import type { Meta, StoryObj } from "@storybook/react-vite";
import { WikiTextarea } from ".";

const meta = {
  title: "input/WikiTextarea",
  component: WikiTextarea,
  args: {
    label: "About",
    placeholder: "Write a short bio",
    maxLength: 120,
  },
} satisfies Meta<typeof WikiTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NearLimit: Story = {
  args: {
    value: "A page about social dance nights in the city.",
  },
};
