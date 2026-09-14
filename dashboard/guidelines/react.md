# React

Dashboard is a Vite SPA. Functional components only. React Compiler is on — do not add `memo` / `useMemo` / `useCallback` unless profiling shows a need.

Canonical references: `pages/Auth/Login/`, `components/primitive/Icon/`, `components/layout/PageComponent/`, `foundations/theme.ts`, `state/ui.ts`, `services/auth/auth.ts`.

## How to write code

Keep it functional and small. Data in, UI out. Derive with `map` / `filter` / a short function next to the use. Do not introduce classes, factories, generic wrappers, or a new file for a one-off.

Names must be obvious to a human reading the screen, not clever or typed like an architecture diagram. Prefer the word you would say out loud: `page`, `user`, `links`, `title`, `onSubmit`.

```tsx
// yes
const page = data?.data;
const links = (page?.sections ?? []).map((section, i) => ({
  label: section.title,
  link: `#${i}`,
  order: 4,
}));

// no
const currentPageEntity = responsePayload?.data;
const tableOfContentLinkItems = (currentPageEntity?.sections ?? []).map(...)
```

```tsx
// yes — logic stays in the component until a second caller needs it
const pages = (data?.data ?? []).filter((page) => page.name.includes(search));

// no — extra hook/helper for a single filter
const { filteredPages } = useFilteredPages(searchString);
```

If two names seem equally good, or you are guessing the domain word (`event` vs `page`, `section` vs `block`), stop and ask. Do not invent a parallel vocabulary.

Do not over-engineer:

- No new helper, hook, context, or folder until a second caller exists.
- No extra props/types “for later”.
- No wrapper around a single Mantine component unless it is already a `Wiki*` primitive.
- Keep a screen in one or two files until form/state actually hurts. Login is the split to copy, not the default for a static page.

## Layers

Imports flow downward. A layer must not import from a layer above it.

```
pages → layout / input / button / primitive / feedback / hooks / services / foundations
        + own area patterns
layout / feedback → primitive / foundations
input, button → primitive / foundations
primitive → Mantine (and CSS modules)
```

| Layer | Role | Public names |
| --- | --- | --- |
| `primitive/` | Reusable wrappers around Mantine/HTML. No routes, no API, no domain copy. | `WikiIcon`, `WikiLink`, `WikiList`, `WikiListItem`, `WikiLogo`, `WikiModal` |
| `layout/` | App chrome and page frames. | `PageComponent`, `WikiNavigation`, `WikiSidebar`, `WikiFooter`, `WikiBottomNavigation`, `WikiFull` |
| `input/` | Form controls built on Mantine inputs. | `SearchField`, `WikiTextarea` |
| `button/` | Specialized buttons. | `GoogleButton`, `ShareButton` |
| `feedback/` | Global overlay chrome mounted in `Root`. | `ErrorModal`, `WikiLoader` |

Use the existing Wiki\* wrapper instead of the raw Mantine equivalent (`WikiModal` not `Modal`, `WikiLink` not `Anchor`+`Link`, `WikiIcon` not a raw material-symbol span).

Import from the layer (or domain) barrel:

```tsx
import { WikiIcon, WikiLink } from "@/components/primitive";
import { PageComponent } from "@/components/layout";
import { SearchField } from "@/components/input";
import { GoogleButton } from "@/components/button";
import { HeroSection } from "../patterns";
```

## Component folder

One folder per component:

```
Icon/
  Icon.tsx
  helper.ts           # maps, schemas, small helpers — only if the tsx is crowded
  types.ts            # only when two files in the folder share types
  constants.ts        # only when values are a lookup table
  Icon.module.css     # only when Mantine props are not enough
  index.ts            # public API
```

Do not prefix those files with the component name (`helper.ts`, not `Icon.helper.ts`). Props types live in the component file. Do not add a `.model.ts`.

`index.ts` is the public surface. Internals may default-export; the barrel re-exports the Wiki\* (or domain) name and renames types to `TWiki*`:

```ts
export { default as WikiIcon } from "./Icon";
export type { TIconProps as TWikiIconProps } from "./Icon";
```

New public APIs: named exports from `index.ts`. Types use a `T` prefix (`TLoginParams`, `TIconProps`). Enums use `E` (`EAppMode`).

Related variants of one concept are a namespace object, not parallel top-level components:

```ts
export const PageComponent = { Site: PageComponentSite, Dashboard: PageComponentDashboard };
export const Navigation = { Site: NavigationSimple, Dashboard: NavigationDashboard };
```

Usage: `<PageComponent.Site>`, `<PageComponent.Dashboard>`, `<WikiNavigation.Dashboard />`.

`components/feedback` is global chrome mounted in `Root` (`WikiLoader`, `ErrorModal`). Do not mount a second app-wide loader or error modal inside a page.

## Pages

Routes are declared only in `App.tsx`. `useRouter` is a thin `{ push, back, pathname }` over react-router.

Group screens by area, then by route name:

```
pages/
  Auth/
    Login/
    Signup/
    EmailVerification/
    ForgottenPassword/
  Dashboard/
    Home/              # /home
    Search/            # /search
    Wiki/              # /page/:id
    Profile/           # /profile
      Edit/            # /profile/edit
    Onboarding/
    patterns/          # Dashboard-only UI
```

Auth / marketing screens use `PageComponent.Site` (top nav + footer). Logged-in app screens use `PageComponent.Dashboard` (dashboard nav + sidebar / bottom nav) or `WikiFull` for full-height flows with back/save (profile edit, onboarding, wiki).

A route folder holds the screen. Page-specific components live in that area’s `patterns/` (or next to the route when they are only used there). Do not import across areas (`Auth` must not import `Dashboard/patterns`). Shared UI used by more than one area goes in `components/`.

Split a screen when it has a form or non-trivial state. Follow `Auth/Login/`:

| File | Job |
| --- | --- |
| `LoginPage.tsx` | Route entry: i18n document title, wrap with `PageComponent.*` |
| `Login.tsx` | Presentational UI |
| `useLogin.ts` | Form + mutation + navigation |
| `helper.ts` | Initial values, zod schema |
| `LoginModal.tsx` | Optional modal variant |
| `tests/Login.test.tsx` | Browser test, wrapped in `WikiProvider` |

Keep hooks that are unique to one screen next to that screen. Put a hook in `src/hooks/` only when a second caller needs it (`useRouter`, `usePage`, `useSinglePage`, `useUser`).

## Styling

Mantine is the design system. `WikiProvider` sets `theme` from `src/foundations` and `defaultColorScheme="dark"`.

1. Use Mantine layout/typography props (`Stack`, `Flex`, `Group`, `gap`, `p`, `c`, `fw`, `visibleFrom`, `hiddenFrom`).
2. Colors: `PRIMARY_COLOR`, `primaryShade(n)`, `semanticColor` from `@/foundations`. Do not hardcode the purple palette.
3. Spacing: theme scale (`xs`–`xl`). `theme.ts` maps those to 4px steps.
4. CSS modules colocated with the component, imported as `styles` or `classes`. Use Mantine CSS variables (`var(--mantine-color-body)`, `var(--mantine-spacing-md)`) and PostCSS breakpoints (`$mantine-breakpoint-md` with `min-width` — mobile first). Layout chrome uses `--wiki-nav-height` / `--wiki-footer-height` from `foundations/globals.css`.
5. Extend Mantine defaults in `foundations/theme.ts` (Button, Modal, inputs, Paper, Chip, Badge, Table, Alert, FileInput). Do not fork those defaults in a one-off `style={{}}` unless the component is the exception.

No Tailwind. No new CSS-in-JS library. Page shells use `wikiContainerClass` from `@/foundations` (`.wikiContainer` in `globals.css`). Do not add a second max-width in page CSS.

## Data and state

HTTP: TanStack Query hooks in `src/services/*`. All requests go through `helper/normalizeBaseQuery.ts` (auth header, JSON/file body, loader count, API errors on failure).

Components call service hooks (`useLoginMutation`, `usePagesQuery`). Shared skip/token logic lives in `src/hooks` (`usePage` skips without a token).

Client UI state is Zustand in `state/ui.ts`:

- `loaders` — global overlay count
- `token` — auth token
- `apiErrors` — errors shown by `components/feedback/ErrorModal`

Do not add Redux, axios, or a second query client. Do not `fetch` inside a component. Mutations that fail already surface via `ErrorModal`; check `data.isSuccess` before navigating.

API payloads use `TWikiResponseData<T>` (`helper/request.ts`): `{ isSuccess, code, data }`.

## Forms

`@mantine/form` + zod + `mantine-form-zod-resolver` (`zod4Resolver`). Initial values and schemas live in `helper.ts` (or a `use*ValidationSchema` hook when messages need `t()`). Bind inputs with `getInputProps`. Submit buttons may use `form="id"` when they sit outside the `<form>`.

## i18n

`i18next` + `react-i18next`. Files: `public/locales/{en,it}/{namespace}.json`. Namespaces must be listed in `initializeTranslations.ts`.

```tsx
const { t } = useTranslation("login");
<Title>{t("title")}</Title>
```

Auth screens already do this (`login`, `signup`, `errors`, `common`, …). New or edited user-visible copy must land in both `en` and `it`. Do not grow hardcoded English in pages that you are already touching.

## Tests

Vitest browser (`vitest.browser.config.ts`), `vitest-browser-react`. Wrap with `WikiProvider`. Colocate under `pages/Auth/Login/tests/` (or next to the component, `PageComponent.test.tsx`). Prefer assertions on visible text; snapshots exist for Login/Signup — update them only when the UI change is intentional.
