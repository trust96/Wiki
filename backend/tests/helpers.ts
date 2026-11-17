import { randomUUID } from "node:crypto";
import { hash } from "bcryptjs";
import { createClient } from "redis";
import request from "supertest";
import { app } from "../src/app";
import { PASSWORD_SALT, USER_ROLE } from "../src/helper/constants";
import logger from "../src/helper/logger";
import prisma from "../src/helper/prisma";
import type { Prisma } from "../src/generated/prisma/client";

export { app, logger, prisma };
export const redis = createClient({ url: process.env.REDIS_URL });
export const password = "integration-password";
const fixtureEmails = new Set<string>();
const fixtureIds = new Set<string>();
const sessionKeys = new Set<string>();

export const trackEmail = (email: string) => {
  fixtureEmails.add(email);
  return email;
};

export const testEmail = () => trackEmail(`${randomUUID()}@example.test`);

export const createUser = async (data: Partial<Prisma.UserCreateInput> = {}) => {
  const id = randomUUID();
  const email = testEmail();
  fixtureIds.add(data.id ?? id);
  return prisma.user.create({
    data: { id, email, password: await hash(password, PASSWORD_SALT), role: USER_ROLE.USER, ...data },
  });
};

export const login = async (user: { email: string }, loginPassword = password) => {
  const agent = request.agent(app);
  const response = await agent.post("/api/auth/login").send({ email: user.email, password: loginPassword }).expect(200);
  const cookies = response.headers["set-cookie"];
  const cookie = (Array.isArray(cookies) ? cookies[0] : cookies).split(";")[0];
  const value = decodeURIComponent(cookie.slice(cookie.indexOf("=") + 1));
  if (!value.startsWith("s:") || !value.includes(".")) throw new Error("Expected a signed session cookie");
  const sessionKey = `eventus:${value.slice(2, value.lastIndexOf("."))}`;
  sessionKeys.add(sessionKey);
  return { agent, response, cookie, sessionKey };
};

export const cleanupFixtures = async () => {
  if (sessionKeys.size) await redis.del([...sessionKeys]);
  await prisma.user.deleteMany({
    where: { OR: [{ id: { in: [...fixtureIds] } }, { email: { in: [...fixtureEmails] } }] },
  });
  sessionKeys.clear();
  fixtureIds.clear();
  fixtureEmails.clear();
};
