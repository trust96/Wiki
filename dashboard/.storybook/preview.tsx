import type { Preview } from "@storybook/react-vite";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { theme } from "../src/foundations";
import "material-symbols";
import "@mantine/core/styles.css";
import "../src/foundations/globals.css";

const { hook: memoryHook } = memoryLocation({ path: "/" });

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
        <Router hook={memoryHook}>
          <MantineProvider theme={theme} forceColorScheme={scheme}>
            <ColorSchemeScript forceColorScheme={scheme} />
            <Story />
          </MantineProvider>
        </Router>
      );
    },
  ],
};

export default preview;
