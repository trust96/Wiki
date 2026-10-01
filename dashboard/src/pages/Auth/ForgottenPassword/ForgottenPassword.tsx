import { Stack, Title, Button, TextInput, Text } from "@mantine/core";
import { PageComponent } from "@/components/layout";
import { useTranslation } from "react-i18next";
import { useForgottenPassword } from "./useForgottenPassword";

export const ForgottenPassword = () => {
  const { t } = useTranslation("forgotten_password");
  const { handleSubmit, getInputProps, sent } = useForgottenPassword();

  return (
    <PageComponent.Site
      title={t("document.title")}
      description={t("document.description")}
    >
      <Stack>
        <Title order={2}>{t("title")}</Title>
        <Text>{sent ? t("sent") : t("content")}</Text>
        {sent ? null : (
          <form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <Stack align="center">
              <TextInput
                {...getInputProps("email")}
                label={t("email")}
                type="email"
                w={"100%"}
                autoComplete="email"
              />
              <Button fullWidth type="submit">
                {t("continue_button")}
              </Button>
            </Stack>
          </form>
        )}
      </Stack>
    </PageComponent.Site>
  );
};
