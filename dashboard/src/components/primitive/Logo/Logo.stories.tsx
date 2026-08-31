import type { Meta, StoryObj } from "@storybook/react-vite";
import { Group, Stack, Text } from "@mantine/core";
import { WikiLogo } from ".";

const meta = {
  title: "primitive/WikiLogo",
  component: WikiLogo,
  args: {
    size: "md",
  },
} satisfies Meta<typeof WikiLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Group gap="xl" align="flex-end">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <Stack key={size} gap="xs" align="center">
          <WikiLogo size={size} />
          <Text size="xs">{size}</Text>
        </Stack>
      ))}
    </Group>
  ),
};
