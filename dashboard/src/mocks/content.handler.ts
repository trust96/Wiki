import { http } from "msw";
import { fail, ok } from "./envelope";
import pagesJson from "./pages.json";
import translationsJson from "./translations.json";
import { mockUser } from "./auth.handler";

export const updateProfile = http.put("/api/users/me", async ({ request }) => {
  const body = (await request.json()) as object;

  return ok({ user: { ...mockUser, ...body } });
});

export const pages = http.get("/api/pages", () => ok(pagesJson));

export const singlePage = http.get("/api/pages/:id", ({ params }) => {
  const page = pagesJson.find((page) => String(page.id) === params.id);

  return page ? ok(page) : fail(103, 404);
});

export const translations = http.get("/api/translations", ({ request }) => {
  const locale = new URL(request.url).searchParams.get("locale") ?? "en";

  return ok(translationsJson.filter((row) => row.locale === locale));
});

export const upload = http.post("/api/upload", () =>
  ok({ url: "https://picsum.photos/800/600" }),
);
