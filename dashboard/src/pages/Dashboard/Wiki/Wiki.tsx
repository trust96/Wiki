import { PageComponent } from "@/components/layout";
import { WikiIcon } from "@/components/primitive";
import { PRIMARY_COLOR } from "@/foundations";
import { useSinglePage } from "@/hooks/useSinglePage";
import { useRouter } from "@/hooks/useRouter";
import { Badge, Button, Group, Menu, Stack, Text, Title } from "@mantine/core";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { TableOfContents } from "../patterns";

export const Wiki = () => {
  const { t } = useTranslation("dashboard");
  const { id } = useParams();
  const { push } = useRouter();
  const { data: page } = useSinglePage(Number(id));
  const currentPage = page?.data;
  const links = (currentPage?.sections ?? []).map((section, index) => ({
    label: section.title,
    link: `#${index}`,
    order: 4,
  }));
  const firstSection = currentPage?.sections[0];

  return (
    <PageComponent.Dashboard title={currentPage?.title} description="Wiki">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start">
          <Stack gap="sm">
            <Title c={PRIMARY_COLOR} order={2}>
              {currentPage?.title}
            </Title>
            <Group gap="sm">
              {currentPage?.genre ? (
                <Badge variant="outline">{currentPage.genre}</Badge>
              ) : null}
              <TextMeta label={t("wiki.instructor")} />
              {currentPage?.updatedAt ? (
                <TextMeta
                  label={`${t("wiki.updated")} ${new Date(currentPage.updatedAt).toLocaleDateString()}`}
                />
              ) : null}
            </Group>
          </Stack>
          <Menu>
            <Menu.Target>
              <Button variant="transparent" size="compact-md">
                <WikiIcon name="more_horiz" />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                disabled={!firstSection}
                onClick={() =>
                  push(`/page/${currentPage?.id}/section/${firstSection?.id}`)
                }
              >
                {t("wiki.edit")}
              </Menu.Item>
              <Menu.Item color="red">{t("wiki.delete")}</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <TableOfContents links={links} />
        <Stack gap="lg">
          {currentPage?.sections.map((section, index) => (
            <Stack key={section.id} gap="sm" id={`${index}`}>
              <Title order={4}>{section.title}</Title>
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </PageComponent.Dashboard>
  );
};

const TextMeta = ({ label }: { label: string }) => {
  return (
    <Text size="sm" c="dimmed">
      {label}
    </Text>
  );
};
