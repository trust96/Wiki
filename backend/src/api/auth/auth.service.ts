import { randomBytes } from "node:crypto";
import type { User, AuthTokenPurpose } from "../../generated/prisma/client";
import prisma from "../../helper/prisma";
import { ApiError } from "../../helper/api";
import { emailKey, usernameKey } from "../../helper/identity";
import { hashPassword, verifyPassword } from "../../helper/password";
import { activeAccount, lockAccount } from "./auth.session";
import { cancelTokenMail, enqueueMailRequest, requireMailConfiguration, scheduleTokenMail, tokenHash } from "./auth.mail";

let dummyHash: Promise<string> | undefined;
const dummyPasswordHash = () => dummyHash ??= hashPassword(randomBytes(15).toString("hex"));
export const initializeAuth = async () => { await dummyPasswordHash(); };

export function sessionUser(user: User) {
  if (!user.isOnboarded) return { id: user.id, isOnboarded: false as const };
  if (!user.username || !user.artistName || !user.firstName || !user.lastName || !user.emailVerifiedAt) throw new ApiError("INTERNAL_ERROR");
  return {
    id: user.id, username: user.username, artistName: user.artistName,
    bio: user.bio, avatarUrl: user.avatarUrl, email: user.email,
    firstName: user.firstName, lastName: user.lastName, isOnboarded: true as const,
    emailVerifiedAt: user.emailVerifiedAt.toISOString(),
  };
}

export async function register(input: { email: string; username: string; password: string; termsVersion: string }) {
  requireMailConfiguration();
  const password = await hashPassword(input.password);
  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email, emailKey: emailKey(input.email),
          username: input.username, usernameKey: usernameKey(input.username),
          password, termsVersion: input.termsVersion, termsAcceptedAt: new Date(),
        },
      });
      await scheduleTokenMail(tx, user, "EMAIL_VERIFICATION");
    });
  } catch (error) {
    if (error?.code === "P2002") throw new ApiError("IDENTITY_UNAVAILABLE");
    throw error;
  }
}

export async function authenticate(identifier: string, password: string) {
  const user = await prisma.user.findUnique({
    where: identifier.includes("@") ? { emailKey: emailKey(identifier) } : { usernameKey: usernameKey(identifier) },
  });
  const matches = await verifyPassword(password, activeAccount(user) ? user.password : await dummyPasswordHash());
  if (!matches || !activeAccount(user)) throw new ApiError("INVALID_CREDENTIALS");
  if (!user.emailVerifiedAt) throw new ApiError("EMAIL_NOT_VERIFIED");
  return user;
}

export async function requestTokenMail(email: string, purpose: AuthTokenPurpose) {
  // Eligibility is resolved asynchronously, so dependency failures cannot disclose it.
  await enqueueMailRequest(email, purpose);
}

export async function consumeToken(rawToken: string, purpose: AuthTokenPurpose, password?: string) {
  const code = purpose === "EMAIL_VERIFICATION" ? "VERIFICATION_TOKEN_INVALID" : "RESET_TOKEN_INVALID";
  const candidate = await prisma.authToken.findUnique({ where: { tokenHash: tokenHash(rawToken) }, select: { id: true, userId: true } });
  if (!candidate) throw new ApiError(code);
  const hashed = password === undefined ? undefined : await hashPassword(password);
  await prisma.$transaction(async (tx) => {
    const user = await lockAccount(tx, candidate.userId);
    const token = await tx.authToken.findUnique({ where: { id: candidate.id } });
    const now = new Date();
    if (!activeAccount(user) || !token || token.purpose !== purpose || token.email !== user.email ||
      token.consumedAt || token.revokedAt || token.expiresAt <= now || (purpose === "EMAIL_VERIFICATION" && user.emailVerifiedAt)) {
      throw new ApiError(code);
    }
    await tx.authToken.update({ where: { id: token.id }, data: { consumedAt: now } });
    await tx.user.update({
      where: { id: user.id },
      data: purpose === "EMAIL_VERIFICATION" ? { emailVerifiedAt: now } : { password: hashed!, sessionVersion: { increment: 1 } },
    });
    await cancelTokenMail(tx, user.id, purpose, now);
  });
}
