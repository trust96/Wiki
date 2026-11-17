import cors from "cors";
import { CORS_ORIGIN } from "../helper/constants";

const origins = CORS_ORIGIN.split(",").map((origin) => origin.trim());

export const corsMiddleware = cors({
  origin: origins,
  credentials: true,
});
