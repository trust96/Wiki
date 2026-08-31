# Storybook

Component workshop for the dashboard. Vite + React + the Wiki Mantine theme. Default scheme is dark, matching `WikiProvider`.

Requires Node 20.19+ (same floor as Vite 7).

## Commands

From the repo root:

```bash
yarn workspace wiki_client storybook          # port 6006
yarn workspace wiki_client build-storybook
```

From `dashboard/`: `yarn storybook`, `yarn build-storybook`.

## How it boots

`.storybook/preview.tsx` wraps every story in `MantineProvider` (theme from `src/theme`) and `MemoryRouter` so `WikiLink` works. Toolbar **Scheme** toggles light/dark via `forceColorScheme`. Do not wrap stories in `WikiProvider` — that locks dark and fights the toolbar. If a story needs Redux, wrap that story only.

## Stories

Colocate `Name.stories.tsx` next to the component. Title is `layer/PublicName`. Import the public export from the folder barrel.

```
primitive/Icon/Icon.stories.tsx     title: primitive/WikiIcon
button/GoogleButton/GoogleButton.stories.tsx
```

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WikiIcon } from ".";

const meta = {
  title: "primitive/WikiIcon",
  component: WikiIcon,
  args: { name: "home" },
} satisfies Meta<typeof WikiIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

Write stories for `primitive`, `input`, and `button`. Skip pages and layout chrome unless you are isolating a specific piece. Do not add a `src/stories/` tree or example Button/Header/Page files.
