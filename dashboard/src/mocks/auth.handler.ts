import { http } from "msw";
import { fail, ok } from "./envelope";
import mayaJson from "./user.json";
import newUserJson from "./newUser.json";
import type { TApiUser } from "@/services/auth/types";

const clone = (user: TApiUser): TApiUser => ({ ...user });

const maya = mayaJson as TApiUser;
const newbie = newUserJson as TApiUser;

let users: TApiUser[] = [clone(maya), clone(newbie)];

const findByEmail = (email: string) =>
  users.find((user) => user.email === email);

const findById = (id: string) => users.find((user) => user.id === id);

export const loginUser = http.post("/api/auth/login", async ({ request }) => {
  const { email } = (await request.json()) as { email?: string };
  const loginEmail =
    email === "user@example.com" ? maya.email : email;

  if (loginEmail === "unverified@example.com") return fail(106, 401);

  const user = loginEmail ? findByEmail(loginEmail) : undefined;
  if (!user) return fail(102, 403);
  return ok(user);
});

export const registerUser = http.post(
  "/api/auth/register",
  async ({ request }) => {
    const { email } = (await request.json()) as { email?: string };
    if (!email || findByEmail(email)) return fail(101, 409);
    users.push({
      id: crypto.randomUUID(),
      email,
      name: null,
      surname: null,
      role: 500,
      verifiedAt: null,
    });
    return ok(null, 201);
  },
);

export const currentUser = http.get("/api/user/:id", ({ params }) => {
  const user = findById(String(params.id));
  return user ? ok(user) : fail(102, 404);
});

export const updateUser = http.put("/api/user/:id", async ({ params, request }) => {
  const user = findById(String(params.id));
  if (!user) return fail(102, 404);
  const body = (await request.json()) as {
    name?: string;
    surname?: string;
    email?: string;
    bio?: string;
  };
  user.name = body.name ?? user.name;
  user.surname = body.surname ?? user.surname;
  if (body.email) user.email = body.email;
  if (typeof body.bio === "string") user.bio = body.bio;
  return ok(user, 201);
});

export const logoutUser = http.post("/api/auth/logout", () => ok(null));

export const forgottenPassword = http.post(
  "/api/auth/forgotten_password",
  async ({ request }) => {
    const { email } = (await request.json()) as { email?: string };
    if (!email || !findByEmail(email)) return fail(102, 403);
    return ok(null);
  },
);

export const resetPassword = http.post(
  "/api/auth/change_forgotten_password/:code",
  () => ok(null),
);
