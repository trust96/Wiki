import { createHash, randomUUID } from "node:crypto";
import type { RequestHandler } from "express";
import { redis } from "../helper/redis";
import { apiFailure } from "../helper/api";

const script = `
  local t = redis.call('TIME')
  local now = tonumber(t[1]) * 1000 + math.floor(tonumber(t[2]) / 1000)
  local window = tonumber(ARGV[1])
  redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', now - window)
  if redis.call('ZCARD', KEYS[1]) >= tonumber(ARGV[2]) then
    local oldest = redis.call('ZRANGE', KEYS[1], 0, 0, 'WITHSCORES')
    return math.max(1, math.ceil((tonumber(oldest[2]) + window - now) / 1000))
  end
  redis.call('ZADD', KEYS[1], now, ARGV[3])
  redis.call('PEXPIRE', KEYS[1], window)
  return 0
`;

const budget = async (ip: string, name: string, window: number, limit: number) => Number(await redis.eval(script, {
  keys: [`wiki:v1:rate:${name}:${createHash("sha256").update(ip).digest("hex")}`],
  arguments: [String(window), String(limit), randomUUID()],
}));

export const rateLimit: RequestHandler = async (req, res, next) => {
  try {
    const ip = req.ip;
    if (!ip) throw new Error("Missing client address.");
    let retry = await budget(ip, "api", 60_000, 120);
    if (!retry && req.method === "POST") {
      const path = req.path.toLowerCase().replace(/\/$/, "");
      if (path === "/v1/auth/login") retry = await budget(ip, "login", 600_000, 10);
      if (path === "/v1/auth/register") retry = await budget(ip, "register", 3_600_000, 5);
      if (["/v1/auth/email-verification/resend", "/v1/auth/password-reset-requests"].includes(path)) retry = await budget(ip, "mail", 3_600_000, 10);
    }
    if (retry) {
      res.setHeader("Retry-After", String(retry));
      apiFailure(res, "RATE_LIMITED");
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};
