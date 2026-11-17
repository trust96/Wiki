import { compare } from "bcryptjs";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { EApiCode } from "../src/helper/constants";
import { app, createUser, login, password, prisma, redis, testEmail, trackEmail } from "./helpers";

describe("registration", () => {
  it("persists a verifiable password hash without returning credentials", async () => {
    const email = testEmail();
    const response = await request(app).post("/api/auth/register").send({ email, password }).expect(201);
    expect(response.body).toEqual({ ok: true, code: null, data: null });
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    expect(user.password).not.toBe(password);
    expect(await compare(password, user.password)).toBe(true);
    expect(await prisma.user.count({ where: { email } })).toBe(1);
  });

  it("rejects a duplicate without changing the existing account", async () => {
    const user = await createUser();
    const response = await request(app).post("/api/auth/register").send({ email: user.email, password: "different-password" }).expect(409);
    expect(response.body).toEqual({ ok: false, code: EApiCode.EmailInUse, data: null });
    expect(await prisma.user.count({ where: { email: user.email } })).toBe(1);
    expect((await prisma.user.findUniqueOrThrow({ where: { id: user.id } })).password).toBe(user.password);
  });

  it.each([
    ["missing email", { password }],
    ["invalid email", { email: "not-an-email", password }],
    ["missing password", { email: "invalid-input@example.test" }],
    ["empty password", { email: "invalid-input@example.test", password: "" }],
    ["missing body", undefined],
  ])("rejects %s without creating a user or session", async (_name, body) => {
    const response = await request(app).post("/api/auth/register").send(body).expect(400);
    expect(response.body).toEqual({ ok: false, code: EApiCode.ValidationError, data: null });
    expect(response.headers["set-cookie"]).toBeUndefined();
    expect(await prisma.user.count()).toBe(0);
    expect(await redis.dbSize()).toBe(0);
  });

  it("normalizes email before persistence and lookup", async () => {
    const email = testEmail();
    const input = trackEmail(`  ${email.toUpperCase()}  `);
    await request(app).post("/api/auth/register").send({ email: input, password }).expect(201);
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    const { agent } = await login({ email: input });
    await agent.get(`/api/user/${user.id}`).expect(200);
  });

  it("detects duplicates after normalization", async () => {
    const user = await createUser();
    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: trackEmail(` ${user.email.toUpperCase()} `), password })
      .expect(409);
    expect(response.body).toEqual({ ok: false, code: EApiCode.EmailInUse, data: null });
  });
});

describe("login and sessions", () => {
  it("persists a Redis session and reuses it on a protected request", async () => {
    const user = await createUser({ name: "Integration", surname: "User" });
    const { agent, response, sessionKey } = await login(user);
    expect(response.body).toEqual({
      ok: true,
      code: null,
      data: { id: user.id, email: user.email, name: user.name, surname: user.surname, role: user.role, verifiedAt: null },
    });
    const session = JSON.parse((await redis.get(sessionKey))!);
    expect(session.user).toEqual({ id: user.id, role: user.role, status: user.status });
    expect(await redis.pTTL(sessionKey)).toBeGreaterThan(0);
    const protectedResponse = await agent.get(`/api/user/${user.id}`).expect(200);
    expect(protectedResponse.body).toEqual(response.body);
  });

  it.each([
    ["unknown email", EApiCode.UserNotFound],
    ["incorrect password", EApiCode.WrongCredentials],
  ])("rejects %s without authenticating the cookie agent", async (failure, code) => {
    const user = await createUser();
    const agent = request.agent(app);
    const response = await agent.post("/api/auth/login").send({
      email: failure === "unknown email" ? testEmail() : user.email,
      password: failure === "incorrect password" ? "wrong-password" : password,
    }).expect(403);
    expect(response.body).toEqual({ ok: false, code, data: null });
    expect(response.headers["set-cookie"]).toBeUndefined();
    const protectedResponse = await agent.get("/api/user").expect(401);
    expect(protectedResponse.body).toEqual({ ok: false, code: EApiCode.Unauthorized, data: null });
    expect(await redis.dbSize()).toBe(0);
  });

  it("rejects invalid login input with a validation error", async () => {
    const response = await request(app).post("/api/auth/login").send({ email: "invalid", password }).expect(400);
    expect(response.body).toEqual({ ok: false, code: EApiCode.ValidationError, data: null });
    expect(response.headers["set-cookie"]).toBeUndefined();
  });

  it("destroys the Redis session so the old cookie cannot be replayed", async () => {
    const user = await createUser();
    const { agent, cookie, sessionKey } = await login(user);
    expect(await redis.exists(sessionKey)).toBe(1);
    const response = await agent.post("/api/auth/logout").expect(200);
    expect(response.body).toEqual({ ok: true, code: null, data: null });
    expect(await redis.exists(sessionKey)).toBe(0);
    const replay = await request(app).get("/api/user").set("Cookie", cookie).expect(401);
    expect(replay.body).toEqual({ ok: false, code: EApiCode.Unauthorized, data: null });
  });
});
