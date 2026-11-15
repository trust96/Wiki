import { config } from "dotenv";

config();

export const {
  PORT = 5000,
  HOST = "localhost",
  NODE_ENV = "development",
  TOKEN_SECRET = "default_secret",
  TOKEN_NAME = "wiki-admin-token",
  APP_NAME = "WikiDance",
  REDIS_URL = "redis://redis:6379",
  CORS_ORIGIN = "http://localhost:3000",
} = process.env;

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
