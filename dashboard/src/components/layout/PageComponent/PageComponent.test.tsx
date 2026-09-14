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

test("dashboard frame uses wikiContainer", async () => {
  const { container, getByText } = await render(
    <PageComponent.Dashboard title="Test" description="Test page">
      <div>dashboard child</div>
    </PageComponent.Dashboard>,
    {
      wrapper: WikiProvider,
    },
  );
  await expect.element(getByText("dashboard child")).toBeInTheDocument();
  expect(container.querySelector(".wikiContainer")).toBeTruthy();
});
