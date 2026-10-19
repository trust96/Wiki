import { PageComponent } from "@/components/layout";
import { WikiIcon } from "@/components/primitive";
import { PRIMARY_COLOR } from "@/foundations";
import { Group, Stack, Text, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";

const EmailVerification = () => {
  const { t } = useTranslation("email_verification");

  return (
    <PageComponent.Site
      title={t("document.title")}
      description={t("document.description")}
    >
      <Stack>
        <Group>
          <WikiIcon name="check_circle" size={48} color={PRIMARY_COLOR} />
          <Title order={2} ta={"center"}>
            {t("title")}
          </Title>
        </Group>
        <Text>{t("content")}</Text>
      </Stack>
    </PageComponent.Site>
  );
};

export default EmailVerification;
