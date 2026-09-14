# Dashboard target system

Chrome, shared pieces, color, spacing, page container, and the rich-text editor. Taken from the active Superdesign drafts in [`dashboard.md`](dashboard.md), not from the current Wiki\* tree.

This file is the visual contract for the first-run rebuild. Product rules stay in `specs/authentication/*`, `specs/wiki/*`, `specs/dashboard_navigation/*`. Screen-to-draft map stays in [`dashboard.md`](dashboard.md). Build order and branches: [`implementation.md`](implementation.md).

Do not copy Superdesign HTML. Do not use Tailwind. CSS is normal stylesheets: Mantine props, CSS modules, and tokens in `dashboard/src/foundations`.

## Locked for this rebuild

- Frontend only. Payloads are mock (MSW). Field names are camelCase we choose (`artistName`, `isOnboarded`, `updatedAt`, `genre`). Zod schemas are the source of truth later; this file only names the pieces.
- Dark theme. IBM Plex Sans. Brand purple only. No new fonts, accent colors, or gradients.
- Mobile first. Default layout is the phone. `min-width` from `$mantine-breakpoint-md` (62em) adds sidebar and wide tables.
- One page container class in CSS, used by every shell.

## Color

Reuse Mantine `brand` already in `dashboard/src/foundations/colors.ts`. Do not invent a second palette.

- `brand.0` `#f5f3ff` … `brand.9` `#4c1d95`
- Dark primary (filled buttons, search titles, wiki H2): `brand.5` `#8b5cf6`
- Name accent on dark titles: `brand.2` `#ddd6fe`
- `brand950` `#2e1065` exists; do not use it as a new accent
- Surfaces: Mantine dark body, `--mantine-color-default-border`, `--mantine-color-default-hover`
- Semantic: danger `red`, success `green`, warning `yellow` (`foundations/semantic.ts`)
- Contribution / notification dots: success = approved, warning = pending, danger = declined

## Type, space, radius, motion

- Font: `"IBM Plex Sans", sans-serif` — 400 / 500 / 600 / 700
- Icons: Material Symbols Outlined, 12 / 14 / 16 / 18 / 20 (`xs`–`xl`). Active nav: FILL 1 + `brand`
- Spacing scale: 4 / 8 / 12 / 16 / 20 (`xs`–`xl`)
- Chrome: `--wiki-nav-height: 56px`, `--wiki-footer-height: 56px`
- Default radius: `md`. Buttons: `xl` pill, size `lg`. Transparent chrome actions drop radius/padding
- Inputs: size `md`, radius `md`. SearchField is the exception (below)
- Paper / Modal: radius `md`
- Motion: none besides the global dots loader + blur

## Container

Today each shell wraps itself in a Mantine `Container`. Target: one class in `dashboard/src/foundations/globals.css`.

`.wikiContainer`

- Default (phone): `width: 100%`, horizontal padding `var(--mantine-spacing-md)`, no max-width
- From `$mantine-breakpoint-md`: `max-width: 72rem`, `margin-inline: auto`, keep the same padding
- Used by `PageComponent.Dashboard`, `PageComponent.Site`, and `WikiFull`
- Media queries for layout are `min-width` only

Mantine `Container` leaves those shells. Do not add a second max-width in page CSS.

## Chrome

**Dashboard** (`PageComponent.Dashboard`) — home, search, wiki article, profile, notifications, section edit

- Column `100dvh`, gap `md`, padding-y `md`, inside `.wikiContainer`
- Top bar 56px: wordmark **Wiki dance** left (no `/logo.svg`), overflow menu right
- Body: scrolling Paper. Phone: no sidebar, 5-icon bottom bar. From `md`: icon sidebar left, no bottom bar
- Nav items: Home, Search, Add (disabled), Notifications (**enabled**), Profile

**Site** (`PageComponent.Site`) — login, signup, email verification, forgotten password

- Centered xl wordmark, scroll body in `.wikiContainer`, copyright footer

**Full** (`WikiFull`) — onboarding, profile edit only

- Back | title | action, hairline divider, padded scroll body, `.wikiContainer`
- Wiki article and section edit use **Dashboard**, not Full (the Superdesign FullChrome slot failed; the draft index in `dashboard.md` wins)

Wordmark: IBM Plex Sans text **Wiki dance**. Do not invent a mark, initials badge, or emoji.

## Pieces to keep (restyle to this file)

Chrome: `PageComponent.Site`, `PageComponent.Dashboard`, `WikiFull`, `WikiNavigation`, `WikiSidebar`, `WikiBottomNavigation`, `WikiFooter`.

Shared:

- `WikiIcon`, `WikiLink`, `WikiList` / `WikiListItem`, `WikiModal`
- `SearchField` — radius `xl`, search icon left, filled brand ActionIcon 32px right
- `WikiTextarea` — counter `n/max` right, bold; max **300**
- `GoogleButton` — default variant, stays disabled
- `ErrorModal`, `WikiLoader`

Mantine as-is (no Wiki\* wrapper): `Button`, `TextInput`, `PasswordInput`, `Checkbox`, `Avatar`, `Badge`, `Card`, `Chip`, `Table`, `Alert`, `Menu`, `FileInput`, `Title`, `Text`, `Paper`, `Divider`.

## Pieces to rewrite in place

- `WikiLogo` — wordmark, not a missing `/logo.svg`
- `HeroSection` — greeting with artist name, live search, genre filters, suggested wikis, sponsor at the bottom
- `UserForm` — artist name first + avatar; Private first/last; bio 300; Complete in the header and as a pill
- Search idle — last 5 wikis: stacked rows on phone, table (Wiki / Genre / Updated) from `md`
- Wiki article — Dashboard chrome, genre badge, TOC, `more_horiz` Edit/Delete, no likes/comments
- Contribution cards and status filters — match the profile draft (fix labels)
- Notifications nav item — enabled; route comes later

## Pieces to add

Dashboard patterns (`pages/Dashboard/patterns/`, two or more Dashboard screens):

- **GenreFilters** — compact pills, multi-select (home + search)
- **WikiSummary** — title, excerpt, outline genre badge, relative time; optional status (home + profile)
- **ContributionStatus** — Badge `dot` (profile + notifications)
- **AvatarField** — Avatar `lg` + file upload next to artist name (onboarding + profile edit)
- **ReasonBanner** — Alert with the decline reason (notifications + section form)

`components/input/`:

- **WikiEditor** — Lexical (`lexical` + `@lexical/react`). Toolbar: bold, italic, underline, strikethrough, headings, lists, links, images. CSS module, dark Wiki theme. Mock `content` is an HTML string so the article read view does not hydrate the editor. Remove TipTap / `@mantine/tiptap` when this lands.

Page-only (Mantine, not a shared Wiki\*): Latest wikis table from `md`; article overflow `Menu`; contribution filter row All / Pending / Approved / Declined / Abandoned.

Not in first-run: Add-wiki modal, social feed, Share on the current-user profile.

## How screens compose

- **Onboarding** — Full + heading “Pick the name the community will see” + UserForm (AvatarField, WikiTextarea) + Complete
- **Home** — Dashboard + greeting + SearchField + GenreFilters + WikiSummary list + sponsor
- **Search** — Dashboard + SearchField + GenreFilters; idle Latest wikis; query → list (WikiSummary or WikiListItem) + infinite scroll
- **Wiki** — Dashboard + brand H2 + genre badge + TOC + HTML sections + overflow menu
- **Profile** — Dashboard + Avatar + artistName + bio + Edit/Manage links + filter pills + WikiSummary cards with ContributionStatus
- **Notifications** — Dashboard + list with ContributionStatus, reason, Open wiki / Edit content
- **Section form** — Dashboard + ReasonBanner (if declined) + WikiEditor + Save

## Layer rule

No wrapper around a single Mantine control unless it is already a Wiki\* primitive. Shared by two Dashboard screens → `pages/Dashboard/patterns/`. Shared by Auth and Dashboard, or a real form control (SearchField, WikiTextarea, WikiEditor) → `components/`.
