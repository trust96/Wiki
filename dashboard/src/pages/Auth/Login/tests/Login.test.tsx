import { render } from "vitest-browser-react";
import { test, expect } from "vitest";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import WikiProvider from "@/WikiProvider";
import { Login } from "../Login";

const { hook } = memoryLocation({ path: "/auth/login" });

test("renders login when specified", async () => {
  const { asFragment } = await render(<Login />, {
    wrapper: ({ children }) => (
      <Router hook={hook}>
        <WikiProvider>{children}</WikiProvider>
      </Router>
    ),
  });
  expect(asFragment()).toMatchSnapshot();
});
