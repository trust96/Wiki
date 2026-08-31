import type { Meta, StoryObj } from "@storybook/react-vite";
import { Group, Stack, Text } from "@mantine/core";
import { WikiIcon } from ".";

const meta = {
  title: "primitive/WikiIcon",
  component: WikiIcon,
  args: {
    name: "home",
    size: "md",
    isOutlined: true,
  },
} satisfies Meta<typeof WikiIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: {
    isOutlined: false,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Group gap="lg" align="flex-end">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Stack key={size} gap={4} align="center">
          <WikiIcon {...args} size={size} />
          <Text size="xs">{size}</Text>
        </Stack>
      ))}
    </Group>
  ),
};
