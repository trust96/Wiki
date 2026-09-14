import {
  Button,
  Checkbox,
  createTheme,
  Modal,
  Paper,
  PasswordInput,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { brand, PRIMARY_COLOR } from "./colors";

export const theme = createTheme({
  fontFamily: '"IBM Plex Sans", sans-serif',
  primaryColor: PRIMARY_COLOR,
  primaryShade: { light: 6, dark: 5 },
  autoContrast: true,
  defaultRadius: "md",
  colors: {
    brand,
    violet: brand,
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },
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
    Select: Select.extend({
      defaultProps: {
        size: "md",
      },
    }),
    Checkbox: Checkbox.extend({
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
