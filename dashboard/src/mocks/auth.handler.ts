import { http } from "msw";
import { fail, ok } from "./envelope";
import userJson from "./user.json";

export const mockUser = {
  ...userJson,
  id: 1,
  email: "user@example.com",
  username: "admin",
  role: "user",
  emailVerifiedAt: "2026-01-01T00:00:00Z",
};

export const loginUser = http.post("/api/auth/login", async ({ request }) => {
  const { identifier } = (await request.json()) as any;

  if (identifier === "unverified@example.com") return fail(101, 401);

  if (identifier !== "admin" && identifier !== mockUser.email)
    return fail(100, 401);

  return ok({ token: "mock-token", user: mockUser });
});

export const registerUser = http.post(
  "/api/auth/register",
  async ({ request }) => {
    const { email, username } = (await request.json()) as any;

    return ok({ user: { ...mockUser, email, username } });
  },
);

export const currentUser = http.get("/api/auth/me", () =>
  ok({ user: mockUser }),
);

export const logoutUser = http.post("/api/auth/logout", () => ok());

// These endpoints have no payload back, only the envelope.
export const authStubHandlers = [
  "verify-email",
  "resend-verification",
  "forgot-password",
  "reset-password",
].map((route) => http.post(`/api/auth/${route}`, () => ok()));
