import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Request, Response, RequestHandler } from "express";
import type { User, Prisma } from "../../generated/prisma/client";
import { apiConfig } from "../../helper/config";
import { ApiError } from "../../helper/api";
import { redis } from "../../helper/redis";
import prisma from "../../helper/prisma";

const idleMs = 24 * 60 * 60 * 1000;
const absoluteMs = 30 * idleMs;
const cookieName = apiConfig.nodeEnv === "production" ? "__Host-wiki_session" : "wiki_session";
const cookieOptions = { httpOnly: true, secure: apiConfig.nodeEnv === "production", sameSite: "lax" as const, path: "/" };
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
const key = (id: string) => `wiki:v1:session:${digest(id)}`;
const signature = (id: string) => createHmac("sha256", apiConfig.sessionSecret).update(id).digest("base64url");
const same = (left: string, right: string) => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
};

interface Session {
  userId: string;
  version: number;
  csrfToken: string;
  createdAt: number;
  lastSeenAt: number;
}

interface AuthContext {
  id: string;
  session: Session;
  user: User;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export const activeAccount = (user: User | null): user is User =>
  !!user && !user.deletedAt && !user.bannedAt && !!user.emailKey && !!user.usernameKey && !!user.username && !!user.termsVersion && !!user.termsAcceptedAt;

export const lockAccount = async (tx: Prisma.TransactionClient, id: string) => {
  await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${id} FOR UPDATE`;
  return tx.user.findUnique({ where: { id } });
};

const validSession = (session: Session, now: number) =>
  session && typeof session.userId === "string" && Number.isInteger(session.version) &&
  typeof session.csrfToken === "string" && /^[A-Za-z0-9_-]{43}$/.test(session.csrfToken) &&
  Number.isFinite(session.createdAt) && Number.isFinite(session.lastSeenAt) &&
  session.createdAt <= session.lastSeenAt && session.lastSeenAt <= now &&
  now - session.createdAt < absoluteMs && now - session.lastSeenAt < idleMs;

export const loadSession: RequestHandler = async (req, res, next) => {
  try {
    const cookie = req.cookies?.[cookieName];
    if (typeof cookie !== "string" || !/^[A-Za-z0-9_-]{43}\.[A-Za-z0-9_-]{43}$/.test(cookie)) return next();
    const [id, mac] = cookie.split(".");
    if (!same(signature(id), mac)) return next();
    const encoded = await redis.get(key(id));
    if (!encoded) {
      clearSessionCookie(res);
      return next();
    }
    let session: Session;
    try {
      session = JSON.parse(encoded);
    } catch {
      throw new ApiError("INTERNAL_ERROR");
    }
    const user = validSession(session, Date.now()) ? await prisma.user.findUnique({ where: { id: session.userId } }) : null;
    if (!activeAccount(user) || !user.emailVerifiedAt || user.sessionVersion !== session.version) {
      await redis.del(key(id));
      clearSessionCookie(res);
      return next();
    }
    req.auth = { id, session, user };
    if (!user.isOnboarded && !["/auth/session", "/auth/logout"].includes(req.path.toLowerCase().replace(/\/$/, ""))) {
      return next(new ApiError("FORBIDDEN"));
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const checkOrigin: RequestHandler = (req, _res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const origin = req.get("Origin");
  if (!origin || !apiConfig.origins.includes(origin)) return next(new ApiError("FORBIDDEN"));
  next();
};

export const checkCsrf: RequestHandler = (req, _res, next) => {
  if (req.auth && !same(req.get("X-CSRF-Token") ?? "", req.auth.session.csrfToken)) return next(new ApiError("CSRF_INVALID"));
  next();
};

export const requireSession: RequestHandler = (req, _res, next) => next(req.auth ? undefined : new ApiError("UNAUTHENTICATED"));
export const requireAnonymous: RequestHandler = (req, _res, next) => next(req.auth ? new ApiError("FORBIDDEN") : undefined);
export const clearSessionCookie = (res: Response) => res.clearCookie(cookieName, cookieOptions);

export async function createSession(req: Request, res: Response, user: User) {
  if (cookieOptions.secure && !req.secure) throw new ApiError("INTERNAL_ERROR");
  const id = randomBytes(32).toString("base64url");
  const now = Date.now();
  const session: Session = { userId: user.id, version: user.sessionVersion, csrfToken: randomBytes(32).toString("base64url"), createdAt: now, lastSeenAt: now };
  let currentUser: User;
  try {
    currentUser = await prisma.$transaction(async (tx) => {
      const current = await lockAccount(tx, user.id);
      if (!activeAccount(current) || !current.emailVerifiedAt || current.password !== user.password || current.sessionVersion !== user.sessionVersion) {
        throw new ApiError("INVALID_CREDENTIALS");
      }
      await redis.set(key(id), JSON.stringify(session), { PX: idleMs });
      return current;
    });
  } catch (error) {
    await redis.del(key(id)).catch(() => {});
    throw error;
  }
  res.cookie(cookieName, `${id}.${signature(id)}`, { ...cookieOptions, maxAge: idleMs });
  return { csrfToken: session.csrfToken, user: currentUser };
}

export async function destroySession(req: Request, res: Response) {
  if (req.auth) await redis.del(key(req.auth.id));
  clearSessionCookie(res);
}

export async function touchSession(req: Request, res: Response) {
  if (!req.auth) throw new ApiError("UNAUTHENTICATED");
  const auth = req.auth;
  const user = await prisma.$transaction(async (tx) => {
    const current = await lockAccount(tx, auth.user.id);
    if (!activeAccount(current) || !current.emailVerifiedAt || current.sessionVersion !== auth.session.version) throw new ApiError("UNAUTHENTICATED");
    return current;
  });
  const result = await redis.eval(`
      local raw = redis.call('GET', KEYS[1])
      if not raw then return 0 end
      local s = cjson.decode(raw)
      local now = tonumber(ARGV[1])
      if s.version ~= tonumber(ARGV[2]) or now - s.lastSeenAt >= tonumber(ARGV[3]) or now - s.createdAt >= tonumber(ARGV[4]) then return 0 end
      local ttl = math.min(tonumber(ARGV[3]), s.createdAt + tonumber(ARGV[4]) - now)
      s.lastSeenAt = now
      redis.call('SET', KEYS[1], cjson.encode(s), 'PX', ttl)
      return ttl
    `, { keys: [key(auth.id)], arguments: [String(Date.now()), String(auth.session.version), String(idleMs), String(absoluteMs)] });
  const ttl = Number(result);
  if (ttl <= 0) throw new ApiError("UNAUTHENTICATED");
  res.cookie(cookieName, `${auth.id}.${signature(auth.id)}`, { ...cookieOptions, maxAge: ttl });
  return user;
}
