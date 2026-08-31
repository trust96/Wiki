import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "@mantine/core";
import { fn } from "storybook/test";
import { WikiModal } from ".";

const meta = {
  title: "primitive/WikiModal",
  component: WikiModal,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    opened: true,
    onClose: fn(),
    title: "Edit profile",
    children: <Text>Save changes to your public profile.</Text>,
  },
} satisfies Meta<typeof WikiModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    closeProps: { label: "Cancel" },
    confirmProps: { label: "Save", onClick: fn() },
  },
};
