import { apiConfig } from "./config";

export const {
  PORT = 5000,
  HOST = "localhost",
  TOKEN_NAME = "wiki-admin-token",
  APP_NAME = "WikiDance",
  REDIS_URL = "redis://redis:6379",
} = process.env;

export const NODE_ENV = apiConfig.nodeEnv;
export const TOKEN_SECRET = apiConfig.sessionSecret;
export const CORS_ORIGIN = apiConfig.origins.join(",");

export const PASSWORD_SALT = Number(process.env.PASSWORD_SALT ?? 10);

export const MAX_AGE = 1000 * 60 * 60 * 24 * 60; // 2 months

export enum USER_ROLE {
  ADMIN = 100,
  MODERATOR = 250,
  USER = 500,
}

export const EApiCode = {
  Ok: null,
  WrongCredentials: 100,
  EmailInUse: 101,
  UserNotFound: 102,
  Unauthorized: 103,
  Forbidden: 104,
  ValidationError: 105,
  AccountNotVerified: 106,
  ServerError: 500,
} as const;
