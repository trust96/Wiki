# Dashboard agent

React SPA (`wiki_client`). Vite + React 19 + Mantine 8 + TanStack Query + Zustand + react-router 7.

This file is the index. Conventions live in `guidelines/*.md`. Do not copy those docs here — add a new guideline file and link it.

## Before changing code

Read every markdown file in `guidelines/`:

- [`guidelines/react.md`](guidelines/react.md) — folders, components, pages, styling, state, i18n, tests
- [`guidelines/storybook.md`](guidelines/storybook.md) — Storybook, colocated `*.stories.tsx`

Then match the nearest existing file in the same layer. Prefer extending current patterns over introducing a new stack or folder shape.

Write simple functional React: short names a person can read aloud, no extra abstractions. If a name is unclear, ask before shipping it.

## Commands

From the repo root:

```bash
yarn workspace wiki_client dev        # Vite, port 3000
yarn workspace wiki_client test       # Vitest browser (Chrome)
yarn workspace wiki_client storybook  # Storybook, port 6006
yarn workspace wiki_client build
```

From `dashboard/`: `yarn dev`, `yarn test`, `yarn storybook`, `yarn build`.

## Design

Screen drafts and Superdesign links: [`../specs/design/dashboard.md`](../specs/design/dashboard.md). Product rules stay in `specs/`. Do not copy Superdesign HTML into the app.

## How it boots

`main.tsx` starts MSW, then mounts `Root`. `Root` wraps `App` in `WikiProvider` (TanStack Query + Router + Mantine, default dark) and mounts global `WikiLoader` + `ErrorModal`. Routes live in `App.tsx`.

Alias: `@/` → `src/`.

## Source map

```
src/
  pages/
    Auth/         login, signup, email, password
    Dashboard/    home, search, wiki, profile, onboarding + patterns/
  components/
    primitive/    Mantine/HTML wrappers, Wiki* public API
    layout/       shells, nav, page frames
    input/        form controls
    button/       specialized buttons
    feedback/     WikiLoader, ErrorModal
  foundations/    tokens, Mantine theme, global CSS
  hooks/          shared data/nav hooks (useRouter is thin)
  services/       TanStack Query hooks + HTTP
  state/          Zustand UI store (token, loader, errors)
  helper/         fetch adapter, request types, constants, small utils
  mocks/          MSW
public/locales/   i18next JSON (en, it)
```

Shared UI goes in the matching `components/` type folder (`button/`, `input/`, …). Page-specific UI lives in that area’s `patterns/` (e.g. `pages/Dashboard/patterns/`). Routes stay in `App.tsx`. Do not recreate a flat `components/<Name>` tree.

## Non-negotiables

- Simple, human names. If you hesitate on a name, ask.
- Do not over-engineer: no new helper/hook/folder until a second caller needs it.
- Import from layer barrels (`@/components/primitive`), not from another space (`backend/`, `site/`).
- User-visible strings for new or touched UI go through i18next (`public/locales/{en,it}`).
- HTTP goes through `services/` + `normalizeBaseQuery`. Do not `fetch` from components.
- Call only paths listed as shipped in [`../backend/endpoints.md`](../backend/endpoints.md). That file is the live API contract. Do not follow leftover Strapi URLs.
- Style with Mantine props and `src/foundations` first. CSS modules are the exception.
- Browser-verify UI changes (real interaction, not only a screenshot).
