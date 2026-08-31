import { MantineProvider } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { store } from "./state/store";
import { theme } from "./theme";

const WikiProvider = (props: PropsWithChildren) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          {props.children}
        </MantineProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default WikiProvider;
