import { render } from "vitest-browser-react";
import { test, expect } from "vitest";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import WikiProvider from "@/WikiProvider";
import { Signup } from "../Signup";

const { hook } = memoryLocation({ path: "/auth/signup" });

test("renders signup when specified", async () => {
  const { asFragment } = await render(<Signup />, {
    wrapper: ({ children }) => (
      <Router hook={hook}>
        <WikiProvider>{children}</WikiProvider>
      </Router>
    ),
  });
  expect(asFragment()).toMatchSnapshot();
});
