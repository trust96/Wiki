import { render } from "vitest-browser-react";
import { test, expect } from "vitest";
import WikiProvider from "@/WikiProvider";
import { Signup } from "../Signup";

test("renders signup when specified", async () => {
  const { asFragment } = await render(<Signup />, {
    wrapper: WikiProvider,
  });
  expect(asFragment()).toMatchSnapshot();
});
