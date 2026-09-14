import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { WikiEditor } from ".";

const meta = {
  title: "input/WikiEditor",
  component: WikiEditor,
} satisfies Meta<typeof WikiEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "<p>The salsa step in house dance.</p>",
    onChange: () => undefined,
  },
  render: function Render() {
    const [value, setValue] = useState("<p>The salsa step in house dance.</p>");
    return <WikiEditor value={value} onChange={setValue} />;
  },
};
