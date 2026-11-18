import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { EApiCode } from "../src/helper/constants";
import errorHandlingMiddleware from "../src/middleware/errorHandlingMiddleware";
import { responseMiddleware } from "../src/middleware/responseMiddleware";
import { app } from "./helpers";

describe("shared HTTP middleware", () => {
  it.each([{ data: { id: "created" } }, { data: ["first", "second"] }, { data: null }, { data: false }, { data: 0 }, { data: "" }])(
    "sends a successful response preserving data $data",
    async ({ data }) => {
      const successApp = express();
      successApp.use(responseMiddleware);
      successApp.get("/success", (_req, res) => {
        res.success({ status: 201, data });
      });

      const response = await request(successApp).get("/success").expect(201);
      expect(response.body).toEqual({ ok: true, code: null, data });
    },
  );

  it("sends a failed response with the supplied status and API code", async () => {
    const failureApp = express();
    failureApp.use(responseMiddleware);
    failureApp.get("/failure", (_req, res) => {
      res.fail({ status: 409, code: EApiCode.EmailInUse });
    });

    const response = await request(failureApp).get("/failure").expect(409);
    expect(response.body).toEqual({ ok: false, code: EApiCode.EmailInUse, data: null });
  });

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
    errorApp.use(responseMiddleware);
    errorApp.get("/failure", async () => {
      throw new Error("private diagnostic detail");
    });
    errorApp.use(errorHandlingMiddleware);
    const response = await request(errorApp).get("/failure").expect(500);
    expect(response.body).toEqual({ ok: false, code: EApiCode.ServerError, data: null });
  });

  it("formats JSON parser errors before API middleware runs", async () => {
    const response = await request(app).post("/api/auth/login").set("Content-Type", "application/json").send('{"privateDiagnostic":').expect(500);
    expect(response.body).toEqual({ ok: false, code: EApiCode.ServerError, data: null });
  });
});
