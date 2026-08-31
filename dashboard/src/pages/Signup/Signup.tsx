import {
  Box,
  Button,
  Checkbox,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { GoogleButton } from "@/components/button";
import { WikiLink } from "@/components/primitive";
import { useSignup } from "./useSignup";
import { useTranslation } from "react-i18next";

export const Signup = (_) => {
  const { getInputProps, handleSubmit } = useSignup();
  const { t } = useTranslation("signup");

  return (
    <Stack>
      <Box>
        <Title order={2}>{t("title")}</Title>
        <Text c={"dimmed"}>{t("subtitle")}</Text>
      </Box>
      <form onSubmit={handleSubmit} id="signup">
        <Stack>
          <TextInput
            {...getInputProps("email")}
            label={t("email")}
            type="email"
            id="email"
            autoComplete="email"
          />
          <TextInput
            {...getInputProps("username")}
            label={t("username")}
            id="username"
          />
          <PasswordInput
            {...getInputProps("password")}
            autoComplete="current-password"
            label={t("password")}
            id="password"
          />
          <PasswordInput
            {...getInputProps("confirmPassword")}
            label={t("confirm_password")}
            id="confirm_password"
          />
          <Checkbox
            {...getInputProps("terms", { type: "checkbox" })}
            label={t("terms")}
            id="terms"
            size="md"
          />
        </Stack>
      </form>
      <Stack>
        <Button form="signup" type="submit">
          {t("signup_button")}
        </Button>
        <GoogleButton>{t("signup_google_button")}</GoogleButton>
      </Stack>
      <WikiLink c="dimmed" size="xs" fw={"bold"} href="/auth/login">
        {t("login")}
      </WikiLink>
    </Stack>
  );
};
