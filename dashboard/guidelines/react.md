# React

Dashboard is a Vite SPA. Functional components only. React Compiler is on — do not add `memo` / `useMemo` / `useCallback` unless profiling shows a need.

Canonical references: `pages/Login/`, `components/primitive/Icon/`, `components/layout/PageComponent/`, `theme/theme.ts`, `state/store.ts`, `services/auth/auth.ts`.

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
const { filteredPages } = useFilteredEventPages(searchString);
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
pages → feature / layout / input / button / primitive / hooks / services / theme
feature → input / button / primitive / hooks / services / theme
layout → primitive / theme
input, button → primitive / theme
primitive → Mantine (and CSS modules)
```

| Layer | Role | Public names |
| --- | --- | --- |
| `primitive/` | Reusable wrappers around Mantine/HTML. No routes, no API, no domain copy. | `WikiIcon`, `WikiLink`, `WikiList`, `WikiListItem`, `WikiLogo`, `WikiModal` |
| `layout/` | App chrome and page frames. | `PageComponent`, `WikiNavigation`, `WikiSidebar`, `WikiFooter`, `WikiBottomNavigation`, `WikiFull` |
| `input/` | Form controls built on Mantine inputs. | `SearchField`, `WikiTextarea` |
| `button/` | Specialized buttons. | `GoogleButton`, `ShareButton` |
| `feature/` | Domain blocks, grouped by area: `app`, `home`, `profile`, `wiki`. | `HeroSection`, `UserForm`, `TableOfContents`, `ErrorModal`, `WikiLoader` |

Use the existing Wiki\* wrapper instead of the raw Mantine equivalent (`WikiModal` not `Modal`, `WikiLink` not `Anchor`+`Link`, `WikiIcon` not a raw material-symbol span).

Import from the layer (or domain) barrel:

```tsx
import { WikiIcon, WikiLink } from "@/components/primitive";
import { PageComponent } from "@/components/layout";
import { SearchField } from "@/components/input";
import { GoogleButton } from "@/components/button";
import { HeroSection } from "@/components/feature/home";
```

## Component folder

One folder per component:

```
Icon/
  Icon.tsx
  Icon.model.ts       # T* props/types
  Icon.helper.ts      # pure maps, schemas, small helpers
  Icon.constant.ts    # only when values are lookup tables
  Icon.module.css     # only when Mantine props are not enough
  index.ts            # public API
```

`index.ts` is the public surface. Internals may default-export; the barrel re-exports the Wiki\* (or domain) name and renames types to `TWiki*`:

```ts
export { default as WikiIcon } from "./Icon";
export type { TIconProps as TWikiIconProps } from "./Icon.model";
```

New public APIs: named exports from `index.ts`. Types use a `T` prefix (`TLoginParams`, `TIconProps`). Enums use `E` (`EStoreSlice`).

Related variants of one concept are a namespace object, not parallel top-level components:

```ts
export const PageComponent = { Site: PageComponentSite, Dashboard: PageComponentDashboard };
export const Navigation = { Site: NavigationSimple, Dashboard: NavigationDashboard };
```

Usage: `<PageComponent.Site>`, `<PageComponent.Dashboard>`, `<WikiNavigation.Dashboard />`.

`feature/app` is global chrome mounted in `Root` (`WikiLoader`, `ErrorModal`). Do not mount a second app-wide loader or error modal inside a page.

## Pages

Routes are declared only in `App.tsx`. Each screen is a folder under `pages/`.

Auth / marketing screens use `PageComponent.Site` (top nav + footer). Logged-in app screens use `PageComponent.Dashboard` (dashboard nav + sidebar / bottom nav) or `WikiFull` for full-height flows with back/save (profile edit, onboarding, wiki page).

Split a screen when it has a form or non-trivial state. Follow `Login/`:

| File | Job |
| --- | --- |
| `LoginPage.tsx` | Route entry: i18n document title, wrap with `PageComponent.*` |
| `Login.tsx` | Presentational UI |
| `useLogin.ts` | Form + mutation + navigation |
| `Login.helper.ts` | Initial values, yup schema |
| `LoginModal.tsx` | Optional modal variant |
| `tests/Login.test.tsx` | Browser test, wrapped in `WikiProvider` |

Keep hooks that are unique to one screen next to that screen. Put a hook in `src/hooks/` only when a second caller needs it (`useRouter`, `usePage`, `useSinglePage`, `useUser`).

Do not import from another `pages/` folder. Extract shared UI into `feature/` (or a lower layer) instead.

## Styling

Mantine is the design system. `WikiProvider` sets `theme` from `src/theme` and `defaultColorScheme="dark"`.

1. Use Mantine layout/typography props (`Stack`, `Flex`, `Group`, `gap`, `p`, `c`, `fw`, `visibleFrom`, `hiddenFrom`).
2. Colors: `PRIMARY_COLOR`, `primaryShade(n)`, `semanticColor` from `@/theme`. Do not hardcode the purple palette.
3. Spacing: theme scale (`xs`–`xl`). `theme.ts` maps those to 4px steps.
4. CSS modules colocated with the component, imported as `styles` or `classes`. Use Mantine CSS variables (`var(--mantine-color-body)`, `var(--mantine-spacing-md)`) and PostCSS breakpoints (`$mantine-breakpoint-sm`). Layout chrome may use `--wiki-nav-height` / `--wiki-footer-height` from `styles/globals.css`.
5. Extend Mantine defaults in `theme/theme.ts` (Button, Modal, inputs, Paper). Do not fork those defaults in a one-off `style={{}}` unless the component is the exception.

No Tailwind. No new CSS-in-JS library. Do not put page layout in `globals.css`.

## Data and state

HTTP: RTK Query in `src/services/*`, registered in `state/store.ts`. All requests go through `helper/normalizeBaseQuery.ts` (auth header, JSON/file body, loader count, `apiError` on failure).

Components call generated hooks (`useLoginMutation`, `usePagesQuery`). Shared skip/token logic lives in `src/hooks` (`usePage` skips without a token).

UI slices stay thin:

- `uiSlice` — loader count, auth token
- `apiErrorSlice` — errors shown by `feature/app/ErrorModal`
- `modalSlice` — modal flags

Do not add React Query, axios, or a second Redux store. Do not `fetch` inside a component. Mutations that fail already surface via `ErrorModal`; check `data.isSuccess` before navigating.

API payloads use `TWikiResponseData<T>` (`model/baseQuery.model.ts`): `{ isSuccess, code, data }`.

## Forms

`@mantine/form` + yup + `mantine-form-yup-resolver`. Initial values and schemas live in `*.helper.ts` (or a `use*ValidationSchema` hook when messages need `t()`). Bind inputs with `getInputProps`. Submit buttons may use `form="id"` when they sit outside the `<form>`.

## i18n

`i18next` + `react-i18next`. Files: `public/locales/{en,it}/{namespace}.json`. Namespaces must be listed in `initializeTranslations.ts`.

```tsx
const { t } = useTranslation("login");
<Title>{t("title")}</Title>
```

Auth screens already do this (`login`, `signup`, `errors`, `common`, …). New or edited user-visible copy must land in both `en` and `it`. Do not grow hardcoded English in pages that you are already touching.

## Tests

Vitest browser (`vitest.browser.config.ts`), `vitest-browser-react`. Wrap with `WikiProvider`. Colocate under `pages/<Name>/tests/` or next to the component (`PageComponent.test.tsx`). Prefer assertions on visible text; snapshots exist for Login/Signup — update them only when the UI change is intentional.
