import type { Preview } from "@storybook/react-vite";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { MemoryRouter } from "react-router";
import { theme } from "../src/theme";
import "material-symbols";
import "@mantine/core/styles.css";
import "../src/styles/globals.css";

const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "Mantine color scheme",
      toolbar: {
        title: "Scheme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "dark",
  },
  parameters: {
    layout: "padded",
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const scheme = context.globals.theme === "light" ? "light" : "dark";
      return (
        <MemoryRouter>
          <MantineProvider theme={theme} forceColorScheme={scheme}>
            <ColorSchemeScript forceColorScheme={scheme} />
            <Story />
          </MantineProvider>
        </MemoryRouter>
      );
    },
  ],
};

export default preview;
