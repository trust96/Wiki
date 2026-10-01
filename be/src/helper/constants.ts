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

// bcrypt rounds must be a number; env values are always strings.
export const PASSWORD_SALT = Number(process.env.PASSWORD_SALT ?? 10);

export const MAX_AGE = 1000 * 60 * 60 * 24 * 60; // 2 months

export enum USER_ROLE {
  ADMIN,
  MODERATOR,
  USER,
}
