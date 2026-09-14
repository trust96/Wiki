# Dashboard first-run implementation

Rebuild the dashboard UI from the approved specs and Superdesign drafts. Current screens, Wiki\* components, and theme are not the visual baseline. Keep React + Vite + Mantine + react-router + i18n.

Target system (chrome, pieces, color, spacing, container, Lexical): [`system.md`](system.md). Drafts: [`dashboard.md`](dashboard.md). Product rules: `specs/authentication/*`, `specs/wiki/*`, `specs/dashboard_navigation/*`.

Do not copy Superdesign HTML or Tailwind. CSS is Mantine props, CSS modules, and `dashboard/src/foundations`. Mobile first. Frontend only; Zod + MSW camelCase mocks.

## State

Client UI is Zustand in `dashboard/src/state/ui.ts` (token, loader, errors). HTTP is TanStack Query in `dashboard/src/services/*` via `normalizeBaseQuery`. Do not put API lists in Zustand. `@mantine/form` stays for forms. Zod schemas are the payload source of truth.

## Branches

One git branch per step, cut from the previous step. Base: `dashboard/first-run`.

1. `dashboard/catalog` — this step: write [`system.md`](system.md)
2. `dashboard/foundations` — tokens, `.wikiContainer`, theme for Chip / Badge / Table / Alert / FileInput
3. `dashboard/mocks-zod` — camelCase Zod schemas + MSW
4. `dashboard/chrome` — wordmark, container class on shells, Notifications enabled, wiki/section-edit on Dashboard
5. `dashboard/patterns` — GenreFilters, WikiSummary, ContributionStatus, AvatarField, ReasonBanner, WikiEditor (Lexical)
6. `dashboard/screens` — onboarding, home, search, wiki, profile, notifications, declined section form
7. `dashboard/wiring` — login / me → onboarding if not onboarded; Complete → `/home`; `/notifications`
8. `dashboard/cleanup` — drop TipTap and dead page trees; Storybook + tests; browser-check phone then desktop

Signup, verification, and profile-edit use the new chrome/state in the screens wave. Do not patch old `UserForm` / `HeroSection` / `Search`.
