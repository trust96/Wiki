# Dashboard first-run implementation

Rebuild the dashboard UI from the approved specs and Superdesign drafts. Current screens, Wiki\* components, and theme are not the visual baseline. Keep React + Vite + Mantine + react-router + i18n. One branch: `dashboard/first-run`.

Drafts: [`dashboard.md`](dashboard.md). Product rules: `specs/authentication/*`, `specs/wiki/*`, `specs/dashboard_navigation/*`.

Do not copy Superdesign HTML or Tailwind.

## State

Client UI is Zustand in `dashboard/src/state/ui.ts` (token, loader, errors). HTTP is TanStack Query in `dashboard/src/services/*` via `normalizeBaseQuery`. Do not put API lists in Zustand. `@mantine/form` stays for forms.

## Order

1. Write the target system in `specs/design/` (chrome, shared pieces, colors, spacing) from the drafts — not from the current Wiki\* tree.
2. Rewrite tokens in `dashboard/src/foundations`.
3. Rewrite chrome and shared pieces, then the designed screens: onboarding, home, search, wiki, profile, notifications, declined section form.
4. Wire login / already-logged-in → onboarding if not onboarded; Complete → `/home`; enable Notifications in nav.
5. Rewrite tests and Storybook; browser-check against the drafts.

Signup, verification, and profile-edit use the new chrome/state in the same wave. Do not patch old `UserForm` / `HeroSection` / `Search`.
