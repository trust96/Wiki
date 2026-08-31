import type { Meta, StoryObj } from "@storybook/react-vite";
import { WikiLink } from ".";

const meta = {
  title: "primitive/WikiLink",
  component: WikiLink,
  args: {
    href: "/",
    children: "Open home",
  },
} satisfies Meta<typeof WikiLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Muted: Story = {
  args: {
    c: "dimmed",
    td: "none",
    children: "Skip this step",
  },
};
