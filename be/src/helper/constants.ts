import { config } from "dotenv";

config();

export const {
  PORT = 5000,
  HOST = "localhost",
  NODE_ENV = "development",
  TOKEN_SECRET = "default_secret",
  PASSWORD_SALT = 10,
  TOKEN_NAME = "wiki-admin-token",
  APP_NAME = "WikiDance",
} = process.env;

export const MAX_AGE = 1000 * 60 * 60 * 24 * 60; // 2 months

export enum USER_ROLE {
  ADMIN,
  MODERATOR,
  USER,
}
