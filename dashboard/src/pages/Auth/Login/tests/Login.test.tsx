import { render } from "vitest-browser-react";
import { test, expect } from "vitest";
import WikiProvider from "@/WikiProvider";
import { Login } from "../Login";

test("renders login when specified", async () => {
  const { asFragment } = await render(<Login />, {
    wrapper: WikiProvider,
  });
  expect(asFragment()).toMatchSnapshot();
});
