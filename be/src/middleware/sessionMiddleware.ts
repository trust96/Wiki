import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import { TOKEN_SECRET, MAX_AGE, REDIS_URL } from "../helper/constants";
import logger from "../helper/logger";

const redisClient = createClient({ url: REDIS_URL });

try {
  await redisClient.connect();
} catch (error) {
  logger.error(error);
}

const redisStore = new RedisStore({ client: redisClient, prefix: "eventus:" });
export const sessionMiddleware = session({
  store: redisStore,
  resave: true,
  saveUninitialized: false,
  secret: TOKEN_SECRET!,
  cookie: { maxAge: MAX_AGE },
});
