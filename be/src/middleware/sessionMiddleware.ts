import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import { TOKEN_SECRET, MAX_AGE } from "../helper/constants";
import logger from "../helper/logger";

const redisClient = createClient({ url: "redis://redis:6379" });
redisClient.connect().catch(logger.error);

const redisStore = new RedisStore({ client: redisClient, prefix: "eventus:" });
export const sessionMiddleware = session({
  store: redisStore,
  resave: true, // required: force lightweight session keep alive (touch)
  saveUninitialized: false, // recommended: only save session when data exists
  secret: TOKEN_SECRET!,
  cookie: { maxAge: MAX_AGE },
});
