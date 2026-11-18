import { randomUUID } from "node:crypto";
import { compare } from "bcryptjs";
import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { EApiCode, USER_ROLE } from "../src/helper/constants";
import { createUserController } from "../src/api/user/user.controller";
import errorHandlingMiddleware from "../src/middleware/errorHandlingMiddleware";
import { responseMiddleware } from "../src/middleware/responseMiddleware";
import { app, createUser, login, password, prisma, testEmail } from "./helpers";

describe("unrouted user creation controller", () => {
  const creationApp = express();
  creationApp.use(responseMiddleware);
  creationApp.use(express.json());
  creationApp.post("/user", createUserController);
  creationApp.use(errorHandlingMiddleware);

  it("creates a user with usable temporary credentials and mapped fields", async () => {
    const email = testEmail();
    const response = await request(creationApp).post("/user").send({ email, name: "Created", surname: "User" }).expect(201);
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    expect(response.body).toEqual({
      ok: true,
      code: null,
      data: {
        id: user.id,
        email,
        name: "Created",
        surname: "User",
        role: USER_ROLE.USER,
        verifiedAt: null,
        temporaryPassword: expect.any(String),
      },
    });
    expect(response.body.data.temporaryPassword).not.toBe("");
    expect(await compare(response.body.data.temporaryPassword, user.password)).toBe(true);
    expect(response.body.data).not.toHaveProperty("password");
  });

  it("rejects a duplicate without changing the existing user", async () => {
    const user = await createUser();
    const response = await request(creationApp).post("/user").send({ email: user.email, name: "Replacement" }).expect(409);
    expect(response.body).toEqual({ ok: false, code: EApiCode.EmailInUse, data: null });
    expect(await prisma.user.count({ where: { email: user.email } })).toBe(1);
    expect(await prisma.user.findUniqueOrThrow({ where: { id: user.id } })).toEqual(user);
  });
});

describe("user route protection", () => {
  it.each([
    ["get", "/api/user"],
    ["get", "/api/user/example-id"],
    ["put", "/api/user/example-id"],
    ["put", "/api/user/password/example-id"],
    ["delete", "/api/user/example-id"],
  ] as const)("rejects an unauthenticated %s %s", async (method, path) => {
    const response = await request(app)[method](path).expect(401);
    expect(response.body).toEqual({ ok: false, code: EApiCode.Unauthorized, data: null });
  });

  it("does not accept an invalid signed cookie", async () => {
    const response = await request(app).get("/api/user").set("Cookie", "connect.sid=s%3Ainvalid.signature").expect(401);
    expect(response.body).toEqual({ ok: false, code: EApiCode.Unauthorized, data: null });
  });
});

describe("user reads and profile updates", () => {
  it("reads a mapped user without exposing the password hash", async () => {
    const user = await createUser({ name: "Test", surname: "Reader" });
    const { agent } = await login(user);
    const response = await agent.get(`/api/user/${user.id}`).expect(200);
    expect(response.body).toEqual({
      ok: true,
      code: null,
      data: { id: user.id, email: user.email, name: "Test", surname: "Reader", role: user.role, verifiedAt: null },
    });
  });

  it("returns the existing not-found contract for a missing user", async () => {
    const { agent } = await login(await createUser());
    const response = await agent.get(`/api/user/${randomUUID()}`).expect(404);
    expect(response.body).toEqual({ ok: false, code: EApiCode.UserNotFound, data: null });
  });

  it("lists active users other than the current user", async () => {
    const currentUser = await createUser();
    const otherUser = await createUser();
    await createUser({ deletedAt: new Date() });
    const { agent } = await login(currentUser);
    const response = await agent.get("/api/user").expect(200);
    expect(response.body).toMatchObject({ ok: true, code: null });
    expect(response.body.data.map((user: { id: string }) => user.id)).toEqual([otherUser.id]);
    expect(response.body.data[0]).not.toHaveProperty("password");
  });

  it("persists supported profile fields without returning credentials", async () => {
    const user = await createUser();
    const { agent } = await login(user);
    const email = testEmail();
    const response = await agent.put(`/api/user/${user.id}`).send({ email, name: "Updated", surname: "Profile" }).expect(201);
    expect(response.body).toMatchObject({ ok: true, code: null, data: { id: user.id, email, name: "Updated", surname: "Profile" } });
    expect(response.body.data).not.toHaveProperty("password");
    const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(stored).toMatchObject({ email, name: "Updated", surname: "Profile", password: user.password });
  });

  it("preserves mapper defaults and ignores unsupported profile fields", async () => {
    const user = await createUser({ role: USER_ROLE.ADMIN });
    const { agent } = await login(user);
    const response = await agent.put(`/api/user/${user.id}`).send({
      name: null,
      surname: null,
      role: USER_ROLE.ADMIN,
      password: "ignored-password",
      verifiedAt: new Date().toISOString(),
    }).expect(201);
    expect(response.body).toEqual({
      ok: true,
      code: null,
      data: { id: user.id, email: user.email, name: null, surname: null, role: USER_ROLE.USER, verifiedAt: null },
    });
    const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(stored).toMatchObject({ role: USER_ROLE.USER, password: user.password, verifiedAt: null });
  });

  it("preserves nullable roles and serializes verification dates", async () => {
    const verifiedAt = new Date("2025-01-02T03:04:05.000Z");
    const user = await createUser({ role: null, verifiedAt });
    const { agent } = await login(user);
    const response = await agent.get(`/api/user/${user.id}`).expect(200);
    expect(response.body).toEqual({
      ok: true,
      code: null,
      data: { id: user.id, email: user.email, name: null, surname: null, role: null, verifiedAt: verifiedAt.toISOString() },
    });
  });

  it("soft-deletes a user, excluding the account from listing and login", async () => {
    const admin = await createUser({ role: USER_ROLE.ADMIN });
    const target = await createUser();
    const { agent } = await login(admin);
    const response = await agent.delete(`/api/user/${target.id}`).expect(200);
    expect(response.body).toEqual({ ok: true, code: null, data: [] });
    expect((await prisma.user.findUniqueOrThrow({ where: { id: target.id } })).deletedAt).toBeInstanceOf(Date);
    const list = await agent.get("/api/user").expect(200);
    expect(list.body.data).toEqual([]);
    const rejectedLogin = await request(app).post("/api/auth/login").send({ email: target.email, password }).expect(403);
    expect(rejectedLogin.body).toEqual({ ok: false, code: EApiCode.UserNotFound, data: null });
  });
});

describe("password changes", () => {
  it("rejects a missing target without changing existing credentials", async () => {
    const user = await createUser();
    const { agent } = await login(user);
    const response = await agent.put(`/api/user/password/${randomUUID()}`).send({ currentPassword: password, newPassword: "replacement" }).expect(404);
    expect(response.body).toEqual({ ok: false, code: EApiCode.UserNotFound, data: null });
    expect(await prisma.user.findUniqueOrThrow({ where: { id: user.id } })).toEqual(user);
  });

  it("changes the stored hash and accepts only the new password on subsequent login", async () => {
    const user = await createUser();
    const { agent } = await login(user);
    const newPassword = "replacement-password";
    const response = await agent.put(`/api/user/password/${user.id}`).send({ currentPassword: password, newPassword }).expect(200);
    expect(response.body).toEqual({ ok: true, code: null, data: null });
    const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(stored.password).not.toBe(user.password);
    expect(stored.password).not.toBe(newPassword);
    expect(await compare(newPassword, stored.password)).toBe(true);
    await request(app).post("/api/auth/login").send({ email: user.email, password }).expect(403);
    await login(user, newPassword);
  });

  it("rejects an incorrect current password without changing the hash", async () => {
    const user = await createUser();
    const { agent } = await login(user);
    const response = await agent.put(`/api/user/password/${user.id}`).send({ currentPassword: "wrong-password", newPassword: "replacement" }).expect(403);
    expect(response.body).toEqual({ ok: false, code: EApiCode.WrongCredentials, data: null });
    expect((await prisma.user.findUniqueOrThrow({ where: { id: user.id } })).password).toBe(user.password);
  });

  it.each([
    { newPassword: "replacement" },
    { currentPassword: password },
    { currentPassword: password, newPassword: "" },
    { password: "legacy-reset-field" },
  ])("rejects missing password-change fields without changing the hash: %j", async (body) => {
    const user = await createUser();
    const { agent } = await login(user);
    const response = await agent.put(`/api/user/password/${user.id}`).send(body).expect(400);
    expect(response.body).toEqual({ ok: false, code: EApiCode.ValidationError, data: null });
    expect((await prisma.user.findUniqueOrThrow({ where: { id: user.id } })).password).toBe(user.password);
  });
});
