# Dashboard agent

React SPA (`wiki_client`). Vite + React 19 + Mantine 8 + RTK Query + react-router 7.

This file is the index. Conventions live in `guidelines/*.md`. Do not copy those docs here — add a new guideline file and link it.

## Before changing code

Read every markdown file in `guidelines/`:

- [`guidelines/react.md`](guidelines/react.md) — folders, components, pages, styling, state, i18n, tests

Then match the nearest existing file in the same layer. Prefer extending current patterns over introducing a new stack or folder shape.

Write simple functional React: short names a person can read aloud, no extra abstractions. If a name is unclear, ask before shipping it.

## Commands

From the repo root:

```bash
yarn workspace wiki_client dev      # Vite, port 3000
yarn workspace wiki_client test     # Vitest browser (Chrome)
yarn workspace wiki_client build
```

From `dashboard/`: `yarn dev`, `yarn test`, `yarn build`.

## How it boots

`main.tsx` starts MSW, then mounts `Root`. `Root` wraps `App` in `WikiProvider` (Redux + Router + Mantine, default dark) and mounts global `WikiLoader` + `ErrorModal`. Routes live in `App.tsx`.

Alias: `@/` → `src/`.

## Source map

```
src/
  pages/          route screens (one folder per screen)
  components/
    primitive/    Mantine/HTML wrappers, Wiki* public API
    layout/       shells, nav, page frames
    input/        form controls
    button/       specialized buttons
    feature/      domain UI (app, home, profile, wiki)
  hooks/          shared data/nav hooks
  services/       RTK Query APIs
  state/          Redux store + UI slices
  theme/          Mantine theme + brand tokens
  helper/         fetch adapter, constants, small utils
  model/          shared types (API envelope)
  styles/         global CSS only
  mocks/          MSW
public/locales/   i18next JSON (en, it)
```

Put new UI in the matching `components/` layer. Do not recreate a flat `components/<Name>` tree or a `patterns/` tree.

## Non-negotiables

- Simple, human names. If you hesitate on a name, ask.
- Do not over-engineer: no new helper/hook/folder until a second caller needs it.
- Import from layer barrels (`@/components/primitive`), not from another space (`backend/`, `site/`).
- User-visible strings for new or touched UI go through i18next (`public/locales/{en,it}`).
- HTTP goes through `services/` + `normalizeBaseQuery`. Do not `fetch` from components.
- Style with Mantine props and `src/theme` first. CSS modules are the exception.
- Browser-verify UI changes (real interaction, not only a screenshot).
