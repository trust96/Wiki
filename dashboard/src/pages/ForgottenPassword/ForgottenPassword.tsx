import { Stack, Title, Button, TextInput, Text } from "@mantine/core";
import { PageComponent } from "@/components/layout";
import { useTranslation } from "react-i18next";
import { useForgottenPassword } from "./useForgottenPassword";

export const ForgottenPassword = () => {
  const { t } = useTranslation("forgotten_password");
  const { handleSubmit, getInputProps } = useForgottenPassword();

  return (
    <PageComponent.Site
      title={t("document.title")}
      description={t("document.description")}
    >
      <Stack>
        <Title order={2}>{t("title")}</Title>
        <Text>{t("content")}</Text>
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <Stack align="center">
            <TextInput
              {...getInputProps("email")}
              label={"Email"}
              type="email"
              w={"100%"}
              autoComplete="email"
            />
            <Button fullWidth>{t("continue_button")}</Button>
          </Stack>
        </form>
      </Stack>
    </PageComponent.Site>
  );
};
