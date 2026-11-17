import { app } from "./app";
import { PORT, HOST } from "./helper/constants";
import startUp from "./startup";
import { connectRedis, redis } from "./helper/redis";
import prisma from "./helper/prisma";
import { apiConfig } from "./helper/config";
import { requireMailConfiguration, runMailWorker } from "./api/auth/auth.mail";
import logger from "./helper/logger";

const start = async () => {
  let mailReady = true;
  try {
    requireMailConfiguration();
  } catch {
    mailReady = false;
  }
  if (apiConfig.nodeEnv === "production" && (!mailReady || !apiConfig.termsVersion)) throw new Error("Auth deployment configuration is incomplete.");
  await connectRedis();
  await startUp();

  const server = app.listen(Number(PORT), HOST!, () => {
    const address = server.address();
    console.log(`Backend listening on port ${typeof address === "object" && address ? address.port : PORT}.`);
  });
  const abort = new AbortController();
  const worker = mailReady ? runMailWorker(abort.signal) : Promise.resolve();
  if (!mailReady) logger.warn("Auth mail is not configured; registration and mail-request operations are unavailable.");
  let stopping = false;
  const stop = async () => {
    if (stopping) return;
    stopping = true;
    abort.abort();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await worker;
    await redis.quit();
    await prisma.$disconnect();
  };
  process.once("SIGTERM", () => { void stop().catch(() => process.exit(1)); });
  process.once("SIGINT", () => { void stop().catch(() => process.exit(1)); });
  worker.catch(() => {
    logger.error("Auth mail worker stopped unexpectedly.");
    void stop().catch(() => process.exit(1));
  });
};

start().catch(() => {
  console.error("Backend startup failed.");
  process.exit(1);
});
