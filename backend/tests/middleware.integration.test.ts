import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { EApiCode } from "../src/helper/constants";
import errorHandlingMiddleware from "../src/middleware/errorHandlingMiddleware";
import formatResponse from "../src/middleware/formatResponse";
import { app } from "./helpers";

describe("shared HTTP middleware", () => {
  it("allows credentialed preflight requests from the configured origin", async () => {
    const response = await request(app)
      .options("/api/auth/login")
      .set("Origin", "http://integration.test")
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "Content-Type")
      .expect(204);
    expect(response.headers["access-control-allow-origin"]).toBe("http://integration.test");
    expect(response.headers["access-control-allow-credentials"]).toBe("true");
    expect(response.headers["access-control-allow-methods"]).toContain("POST");
  });

  it("does not grant a different origin credentialed browser access", async () => {
    const response = await request(app).options("/api/auth/login").set("Origin", "http://other.test").set("Access-Control-Request-Method", "POST");
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("formats unexpected errors without exposing internal details", async () => {
    const errorApp = express();
    errorApp.use(formatResponse);
    errorApp.get("/failure", () => {
      throw new Error("private diagnostic detail");
    });
    errorApp.use(errorHandlingMiddleware);
    const response = await request(errorApp).get("/failure").expect(500);
    expect(response.body).toEqual({ ok: false, code: EApiCode.ServerError, data: null });
  });
});
