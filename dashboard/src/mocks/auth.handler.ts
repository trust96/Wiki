import { http } from "msw";
import { fail, ok } from "./envelope";
import mayaJson from "./user.json";
import newUserJson from "./newUser.json";
import { userSchema, type TUser } from "@/services/schema";

export const mayaUser: TUser = userSchema.parse(mayaJson);
export const newUser: TUser = userSchema.parse(newUserJson);

export let mockUser: TUser = { ...mayaUser };

export const resetMockUser = () => {
  mockUser = { ...mayaUser };
};

const users: TUser[] = [mayaUser, newUser];

const findUser = (identifier: string) =>
  users.find(
    (user) => user.username === identifier || user.email === identifier,
  );

export const loginUser = http.post("/api/auth/login", async ({ request }) => {
  const { identifier } = (await request.json()) as { identifier?: string };

  if (identifier === "unverified@example.com") return fail(101, 401);

  const loginId =
    identifier === "admin" || identifier === "user@example.com"
      ? "maya"
      : identifier;
  const user = loginId ? findUser(loginId) : undefined;
  if (!user) return fail(100, 401);

  mockUser = { ...user };
  return ok({ token: "mock-token", user: mockUser });
});

export const registerUser = http.post(
  "/api/auth/register",
  async ({ request }) => {
    const { email, username } = (await request.json()) as {
      email?: string;
      username?: string;
    };

    mockUser = {
      ...newUser,
      email: email ?? newUser.email,
      username: username ?? newUser.username,
    };
    return ok({ user: mockUser });
  },
);

export const currentUser = http.get("/api/auth/me", () =>
  ok({ user: mockUser }),
);

export const logoutUser = http.post("/api/auth/logout", () => {
  resetMockUser();
  return ok();
});

export const authStubHandlers = [
  "verify-email",
  "resend-verification",
  "forgot-password",
  "reset-password",
].map((route) => http.post(`/api/auth/${route}`, () => ok()));
