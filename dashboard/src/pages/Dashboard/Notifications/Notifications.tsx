import { PageComponent } from "@/components/layout";
import { useNotifications } from "@/hooks/useNotifications";
import { useRouter } from "@/hooks/useRouter";
import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { ContributionStatus, ReasonBanner } from "../patterns";

export const Notifications = () => {
  const { t } = useTranslation("dashboard");
  const { push } = useRouter();
  const { data } = useNotifications();
  const items = data?.data ?? [];

  return (
    <PageComponent.Dashboard
      title={t("notifications.title")}
      description={t("notifications.description")}
    >
      <Stack gap="md">
        <Title order={2}>{t("notifications.title")}</Title>
        {items.map((item) => (
          <Card key={item.id} withBorder>
            <Stack gap="sm">
              <Group justify="space-between">
                <Text fw={700}>{item.title}</Text>
                <ContributionStatus status={item.status} />
              </Group>
              {item.status === "declined" && item.reason ? (
                <ReasonBanner reason={item.reason} />
              ) : item.reason ? (
                <Text size="sm" c="dimmed">
                  {t("notifications.reason")}: {item.reason}
                </Text>
              ) : null}
              <Group>
                <Button
                  size="compact-sm"
                  variant="outline"
                  onClick={() => push(`/page/${item.wikiId}`)}
                >
                  {t("notifications.openWiki")}
                </Button>
                {item.status === "declined" ? (
                  <Button
                    size="compact-sm"
                    onClick={() =>
                      push(
                        `/page/${item.wikiId}/section/${item.sectionId}?reason=${encodeURIComponent(item.reason ?? "")}`,
                      )
                    }
                  >
                    {t("notifications.editContent")}
                  </Button>
                ) : null}
              </Group>
            </Stack>
          </Card>
        ))}
      </Stack>
    </PageComponent.Dashboard>
  );
};
