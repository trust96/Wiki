import { http } from "msw";
import { fail, ok } from "./envelope";
import pagesJson from "./pages.json";
import contributionsJson from "./contributions.json";
import notificationsJson from "./notifications.json";
import translationsJson from "./translations.json";
import { mockUser } from "./auth.handler";
import {
  contributionSchema,
  notificationSchema,
  wikiSchema,
  type TContribution,
  type TNotification,
  type TWiki,
} from "@/services/schema";

export const mockWikis: TWiki[] = wikiSchema.array().parse(pagesJson);
export const mockContributions: TContribution[] = contributionSchema
  .array()
  .parse(contributionsJson);
export const mockNotifications: TNotification[] = notificationSchema
  .array()
  .parse(notificationsJson);

export const updateProfile = http.put("/api/users/me", async ({ request }) => {
  const body = (await request.json()) as object;
  Object.assign(mockUser, body, { isOnboarded: true });
  return ok({ user: mockUser });
});

export const pages = http.get("/api/pages", () => ok(mockWikis));

export const singlePage = http.get("/api/pages/:id", ({ params }) => {
  const page = mockWikis.find((wiki) => String(wiki.id) === params.id);
  return page ? ok(page) : fail(103, 404);
});

export const contributions = http.get("/api/contributions", () =>
  ok(mockContributions),
);

export const notifications = http.get("/api/notifications", () =>
  ok(mockNotifications),
);

export const updateSection = http.put(
  "/api/pages/:pageId/sections/:sectionId",
  async ({ params, request }) => {
    const body = (await request.json()) as { content?: string };
    const page = mockWikis.find((wiki) => String(wiki.id) === params.pageId);
    const section = page?.sections.find(
      (item) => String(item.id) === params.sectionId,
    );
    if (!page || !section) return fail(103, 404);
    section.content = body.content ?? section.content;
    return ok(section);
  },
);

export const translations = http.get("/api/translations", ({ request }) => {
  const locale = new URL(request.url).searchParams.get("locale") ?? "en";
  return ok(translationsJson.filter((row) => row.locale === locale));
});

export const upload = http.post("/api/upload", () =>
  ok({ url: "https://picsum.photos/800/600" }),
);
