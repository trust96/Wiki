import {
  Button,
  createTheme,
  MantineProvider,
  Modal,
  Paper,
  PasswordInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { store } from "./state/store";

const theme = createTheme({
  fontFamily: '"IBM Plex Sans", sans-serif',
  primaryColor: "violet",
  defaultRadius: "md",
  components: {
    Button: Button.extend({
      defaultProps: {
        radius: "xl",
        size: "lg",
      },
      styles: (_theme, props) => ({
        root: {
          borderRadius: props.variant === "transparent" ? 0 : undefined,
          padding: props.variant === "transparent" ? 0 : undefined,
          height: props.variant === "transparent" ? "auto" : undefined,
        },
      }),
    }),
    Modal: Modal.extend({
      defaultProps: {
        centered: true,
        withinPortal: true,
        radius: "md",
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        size: "md",
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: {
        size: "md",
      },
    }),
    Textarea: Textarea.extend({
      defaultProps: {
        size: "md",
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        radius: "md",
      },
    }),
  },
});

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
