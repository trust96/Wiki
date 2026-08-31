import { PageComponent } from "./PageComponent";
import { render } from "vitest-browser-react";
import { test, expect } from "vitest";
import WikiProvider from "@/WikiProvider";

test("renders children when specified", async () => {
  const { getByText } = await render(
    <PageComponent.Site title="Test" description="Test page">
      <div> i am a child</div>
    </PageComponent.Site>,
    {
      wrapper: WikiProvider,
    },
  );
  await expect.element(getByText("i am a child")).toBeInTheDocument();
});
