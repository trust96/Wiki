# Dashboard design

Visual index for the dashboard first-run and contribution surfaces. Product rules live in the approved specs under `specs/`. Those specs match these drafts. This file maps each screen to its Superdesign draft and the code that should implement it.

Do not copy Superdesign HTML or Tailwind into the app. Rebuild screens and chrome from these drafts with Mantine. Target system (chrome, pieces, color, spacing, container, Lexical): [`system.md`](system.md). Implementation order and branches: [`implementation.md`](implementation.md). Do not treat the current Wiki\* tree or theme as the baseline.

## Where to get the designs

| What | Where |
| --- | --- |
| Superdesign project | [Wiki Dance Dashboard](https://superdesign.dev/teams/3d836524-6c81-47b9-92eb-1e90764386b1/projects/aec57b9b-5091-4103-884f-67d31b5ebe88) |
| Project id | `aec57b9b-5091-4103-884f-67d31b5ebe88` |
| Tokens | [`system.md`](system.md), then `dashboard/src/foundations` |
| Local Superdesign state | `.superdesign/resume.json` |

Preview URL for any draft: `https://p.superdesign.dev/draft/<draft-id>`

## Chrome

| Surface | Chrome | Notes |
| --- | --- | --- |
| Onboarding, profile edit | `WikiFull` | Back / title / Complete. Wordmark is Site chrome only — see [`system.md`](system.md). Superdesign `FullChrome` slot often fails to render children; do not wrap onboarding in that extracted component. |
| Home, Search, Wiki, Profile, Notifications, section edit | `PageComponent.Dashboard` | Top nav + left sidebar (from `md`) / bottom nav (phone). Notifications enabled; Add stays disabled. One `.wikiContainer` class, not Mantine `Container`. |

Extracted Superdesign components (reference only):

| Name | Id | Source |
| --- | --- | --- |
| NavBar | `14ce4776-1292-49a1-b2ad-531b2e9e6367` | `dashboard/src/components/layout/Navigation/NavigationDashboard.tsx` |
| Sidebar | `14afd4bc-7f11-4d56-9f1c-3f77dc9970a5` | `dashboard/src/components/layout/Sidebar/Sidebar.tsx` |
| BottomNav | `8ed23707-3b80-4669-ab36-30bec55bf84e` | `dashboard/src/components/layout/BottomNavigation/BottomNavigation.tsx` |
| SearchField | `72c450bd-f78a-4060-831b-03ed68539cee` | `dashboard/src/components/input/SearchField/SearchField.tsx` |
| FullChrome | `50f5d35f-165b-4c8d-857e-8963a6162145` | `dashboard/src/components/layout/Full/Full.tsx` |

`logo.svg` is missing in the repo. Drafts use the **Wiki dance** wordmark.

## Screens

Active drafts are the ones to implement. Current Home is a baseline of today’s `/home`, not the target.

| Screen | Route | Draft | Version | Status | Chrome | Visible behavior | Code |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Current Home (baseline) | `/home` | [`21a12a34-6ef6-4596-a0cc-d065a5c0b4a7`](https://p.superdesign.dev/draft/21a12a34-6ef6-4596-a0cc-d065a5c0b4a7) | 1 | Reference only | Dashboard | Pixel-ish snapshot of the current homepage | `pages/Dashboard/Home/Home.tsx`, `pages/Dashboard/patterns/HeroSection/` |
| Home after onboarding | `/home` | [`a9e086d4-6317-4af2-b41d-eb937906f91b`](https://p.superdesign.dev/draft/a9e086d4-6317-4af2-b41d-eb937906f91b) | 1 | Active | Dashboard | “Welcome to Wiki dance, Maya”, live search, genre chips, suggested wikis, sponsor at the bottom | same as above |
| Onboarding | `/onboarding` | [`5ca0b01b-c346-4420-88cc-cd8ed9b5729a`](https://p.superdesign.dev/draft/5ca0b01b-c346-4420-88cc-cd8ed9b5729a) | 4 | Active (liked) | `WikiFull` | Artist name first; First / Last under “Private”; bio 300; Complete in the header and as a pill | [`authentication/onboarding.md`](../authentication/onboarding.md) |
| Search | `/search` | [`d776e06a-e7ed-40e5-8efc-135b5bc50598`](https://p.superdesign.dev/draft/d776e06a-e7ed-40e5-8efc-135b5bc50598) | 2 | Active | Dashboard | Idle state: **Latest wikis, last 5**, table columns Wiki / Genre / Updated | [`wiki/search.md`](../wiki/search.md) |
| Wiki article | `/page/:id` | [`1579b9fb-5a7c-4db3-b83a-1e0573e58958`](https://p.superdesign.dev/draft/1579b9fb-5a7c-4db3-b83a-1e0573e58958) | 1 | Active | Dashboard | Read view of one wiki (Salsa step), table of contents, no likes or comments | `pages/Dashboard/Wiki/Wiki.tsx`, `pages/Dashboard/patterns/TableOfContent/` |
| Profile | `/profile` | [`b74c0476-0b06-48c1-880c-e5587ebadb2d`](https://p.superdesign.dev/draft/b74c0476-0b06-48c1-880c-e5587ebadb2d) | 1 | Active | Dashboard | Maya + contribution cards | `pages/Dashboard/Profile/Profile.tsx`, `pages/Dashboard/Profile/ContributionSection.tsx` |
| Notifications | `/notifications` | [`ef6d7292-fdb8-4981-881b-c9be53dc8369`](https://p.superdesign.dev/draft/ef6d7292-fdb8-4981-881b-c9be53dc8369) | 2 | Active | Dashboard | Approved / Declined with reason. Declined opens Edit content | [`dashboard_navigation/notifications.md`](../dashboard_navigation/notifications.md) — no route yet |
| Edit declined section | section form | [`2645c2fb-81a0-4dd9-a43a-5c5cd888f035`](https://p.superdesign.dev/draft/2645c2fb-81a0-4dd9-a43a-5c5cd888f035) | 1 | Active | Dashboard | Reason banner + editor + Save | [`wiki/section/form.md`](../wiki/section/form.md) |

## First-run

1. Login succeeds ([`authentication/login.md`](../authentication/login.md)).
2. If the user is not onboarded, go to `/onboarding`.
3. Complete onboarding → `/home` ([`authentication/onboarding.md`](../authentication/onboarding.md)).
4. From home, search / a wiki / profile / notifications are the places contributions appear. There is no social feed.

The app code may still follow the old path (`/login` → `/home`, onboarding → `/profile`, no `/notifications` route). Implement against the specs above.
