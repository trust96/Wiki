import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchField } from ".";

const meta = {
  title: "input/SearchField",
  component: SearchField,
  args: {
    autoFocus: false,
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    value: "salsa",
  },
};
