import type { Meta, StoryObj } from "@storybook/react-vite";
import { WikiIcon } from "../Icon";
import { WikiList, WikiListItem } from ".";

const meta = {
  title: "primitive/WikiList",
  component: WikiList,
} satisfies Meta<typeof WikiList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <WikiList {...args}>
      <WikiListItem leftSection={<WikiIcon name="home" />}>Home</WikiListItem>
      <WikiListItem leftSection={<WikiIcon name="search" />} isActive>
        Search
      </WikiListItem>
      <WikiListItem leftSection={<WikiIcon name="person" />}>Profile</WikiListItem>
    </WikiList>
  ),
};

export const Hoverable: Story = {
  args: {
    isHoverable: true,
  },
  render: (args) => (
    <WikiList {...args}>
      <WikiListItem>First page</WikiListItem>
      <WikiListItem>Second page</WikiListItem>
      <WikiListItem>Third page</WikiListItem>
    </WikiList>
  ),
};
