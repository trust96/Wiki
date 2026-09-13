import express from "express";
import formatResponse from "./middleware/formatResponse";
import { authRouter } from "./api/auth/auth.route";
import userRouter from "./api/user/user.route";
import morganMiddleware from "./middleware/logMiddleware";
import errorHandlingMiddleware from "./middleware/errorHandlingMiddleware";
import { corsMiddleware } from "./middleware/corsMiddleware";
import { sessionMiddleware } from "./middleware/sessionMiddleware";

export const app = express();
const jsonMiddleware = express.json({ limit: "50mb" });

app.use(jsonMiddleware);
app.use(sessionMiddleware);
app.use(corsMiddleware);
app.use(morganMiddleware);
app.use(formatResponse);
app.use("/", authRouter, userRouter);
app.use(errorHandlingMiddleware);
