import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./api/auth/auth.route";
import morganMiddleware from "./middleware/logMiddleware";
import { corsMiddleware } from "./middleware/corsMiddleware";
import { apiErrorHandler, apiNotFound, noStore, parseApiJson, requireJson } from "./middleware/apiMiddleware";
import { rateLimit } from "./middleware/rateLimit";
import { apiConfig } from "./helper/config";

export const app = express();
app.set("trust proxy", apiConfig.trustedProxies);
app.use(morganMiddleware);
app.use("/api", noStore, corsMiddleware, rateLimit, (req, res, next) => {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});
app.use("/api/v1", requireJson, parseApiJson, cookieParser(), authRouter);
app.use("/api", apiNotFound, apiErrorHandler);
