import type { EApiCode } from "../src/helper/constants";

declare module "express-serve-static-core" {
  interface Response {
    success(options: { status: number; data: unknown }): this;
    fail(options: { status: number; code: NonNullable<(typeof EApiCode)[keyof typeof EApiCode]> }): this;
  }
}
