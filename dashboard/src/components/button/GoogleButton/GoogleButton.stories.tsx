import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { GoogleButton } from ".";

const meta = {
  title: "button/GoogleButton",
  component: GoogleButton,
  args: {
    children: "Continue with Google",
    onClick: fn(),
    disabled: false,
  },
} satisfies Meta<typeof GoogleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
