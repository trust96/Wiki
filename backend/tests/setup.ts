import { afterAll, afterEach, beforeAll, inject } from "vitest";

declare module "vitest" {
  export interface ProvidedContext {
    services: { databaseUrl: string; redisUrl: string };
  }
}

const services = inject("services");
if (!services?.databaseUrl || !services.redisUrl) {
  throw new Error("Integration tests require service URLs from Testcontainers global setup");
}

Object.assign(process.env, {
  NODE_ENV: "test",
  DATABASE_URL: services.databaseUrl,
  REDIS_URL: services.redisUrl,
  TOKEN_SECRET: "integration-test-session-secret-not-for-production",
  PASSWORD_SALT: "4",
  CORS_ORIGIN: "http://integration.test",
});

beforeAll(async () => {
  const { prisma, redis, logger } = await import("./helpers");
  const { connectRedis } = await import("../src/middleware/sessionMiddleware");
  logger.silent = true;
  await Promise.all([prisma.$connect(), redis.connect(), connectRedis()]);
});

afterEach(async () => {
  const { cleanupFixtures } = await import("./helpers");
  await cleanupFixtures();
});

afterAll(async () => {
  const { prisma, redis, logger } = await import("./helpers");
  const { disconnectRedis } = await import("../src/middleware/sessionMiddleware");
  try {
    const results = await Promise.allSettled([prisma.$disconnect(), disconnectRedis(), redis.isOpen ? redis.quit() : undefined]);
    const failures = results.filter((result) => result.status === "rejected");
    if (failures.length) {
      throw new AggregateError(failures.map((result) => result.reason), "Test connection cleanup failed");
    }
  } finally {
    logger.close();
  }
});
