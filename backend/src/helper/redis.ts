import { createClient } from "redis";
import { REDIS_URL } from "./constants";
import logger from "./logger";

export const redis = createClient({
  url: REDIS_URL,
  disableOfflineQueue: true,
  socket: { connectTimeout: 5000, reconnectStrategy: (retries) => Math.min(250 * (retries + 1), 5000) },
});
redis.on("error", () => logger.error("Redis connection failed."));

export const connectRedis = async () => {
  if (!redis.isOpen) await redis.connect();
};
