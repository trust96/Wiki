import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { useState, type PropsWithChildren } from "react";
import { BrowserRouter } from "react-router";
import { theme } from "@/foundations";

const WikiProvider = (props: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
          mutations: { retry: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          {props.children}
        </MantineProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default WikiProvider;
