import cors from "cors";
import { apiConfig } from "../helper/config";

export const corsMiddleware = cors({
  origin: [...apiConfig.origins],
  credentials: true,
  exposedHeaders: ["Retry-After"],
  allowedHeaders: ["Content-Type", "X-CSRF-Token"],
  optionsSuccessStatus: 200,
  preflightContinue: true,
});
