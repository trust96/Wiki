import { test, expect } from "vitest";
import { entryRedirect, guestRedirect, sessionRedirect } from "./authPath";
import type { TUser } from "@/services/schema";

const maya: TUser = {
  id: 1,
  email: "maya@example.com",
  username: "maya",
  artistName: "Maya",
  firstName: "Maya",
  lastName: "Test",
  bio: "",
  avatar: "",
  isOnboarded: true,
  role: "user",
  emailVerifiedAt: "2026-01-01T00:00:00Z",
};

const newbie: TUser = { ...maya, isOnboarded: false, username: "new" };

test("guest stays on auth without a token", () => {
  expect(guestRedirect("", undefined, false)).toBeNull();
});

test("guest waits while me is pending", () => {
  expect(guestRedirect("token", undefined, true)).toBeNull();
});

test("guest with a settled empty user goes to login", () => {
  expect(guestRedirect("token", undefined, false)).toBe("/auth/login");
});

test("guest with onboarded user goes home", () => {
  expect(guestRedirect("token", maya, false)).toBe("/home");
});

test("guest with new user goes onboarding", () => {
  expect(guestRedirect("token", newbie, false)).toBe("/onboarding");
});

test("session without token goes to login", () => {
  expect(sessionRedirect("", undefined, false, "/home")).toBe("/auth/login");
});

test("session waits while me is pending", () => {
  expect(sessionRedirect("token", undefined, true, "/home")).toBeNull();
});

test("session invalid user goes to login", () => {
  expect(sessionRedirect("token", undefined, false, "/home")).toBe(
    "/auth/login",
  );
});

test("session onboarded user on onboarding goes home", () => {
  expect(sessionRedirect("token", maya, false, "/onboarding")).toBe("/home");
});

test("session new user on home goes onboarding", () => {
  expect(sessionRedirect("token", newbie, false, "/home")).toBe("/onboarding");
});

test("session new user on onboarding stays", () => {
  expect(sessionRedirect("token", newbie, false, "/onboarding")).toBeNull();
});

test("session onboarded user on home stays", () => {
  expect(sessionRedirect("token", maya, false, "/home")).toBeNull();
});

test("entry without token goes to login", () => {
  expect(entryRedirect("", undefined, false)).toBe("/auth/login");
});

test("entry waits while me is pending", () => {
  expect(entryRedirect("token", undefined, true)).toBeNull();
});

test("entry with token but no user goes to login", () => {
  expect(entryRedirect("token", undefined, false)).toBe("/auth/login");
});

test("entry with onboarded Maya goes home", () => {
  expect(entryRedirect("token", maya, false)).toBe("/home");
});

test("entry with new user goes onboarding", () => {
  expect(entryRedirect("token", newbie, false)).toBe("/onboarding");
});
