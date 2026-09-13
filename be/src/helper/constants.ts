import { config } from "dotenv";

config();
const isProduction = process.env.NODE_ENV === "production";
const localBackendServerUrl = "http://localhost:5000";
const remoteBackendServerUrl = "http://api.wikidance.it";
const localFrontendServerUrl = "http://localhost:3000";
const remoteFrontendServerUrl = "http://eventus.wikidance.it";
export const SERVER_URL = isProduction ? remoteBackendServerUrl : localBackendServerUrl;
export const CLIENT_URL = isProduction ? remoteFrontendServerUrl : localFrontendServerUrl;
export const PASSWORD_SALT = 10;
export const TOKEN_NAME = "wiki-admin-token";
export const APP_NAME = "Gemma";
export const MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days
export enum USER_ROLE {
  ADMIN,
  MODERATOR,
  USER,
}
export enum USER_STATUS {
  VERIFIED,
  BANNED,
}
export enum ENTITY_ACTION {
  CREATE,
  UPDATE,
  DELETE,
  RETRIEVE,
}
export const { PORT, HOST, AWS_SECRET_KEY, AWS_PUBLIC_KEY, BUCKET_NAME, AWS_REGION, NODE_ENV, TOKEN_SECRET, GOOGLE_EMAIL, GOOGLE_PASSWORD } = process.env;
