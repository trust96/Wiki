import { Avatar, Button, Divider, Group, Spoiler, Stack, Text } from "@mantine/core";
import { PageComponent } from "@/components/layout";
import { WikiIcon } from "@/components/primitive";
import { useContributions } from "@/hooks/useContributions";
import { useRouter } from "@/hooks/useRouter";
import { useUser } from "@/hooks/useUser";
import type { TContributionStatus } from "@/services/schema";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { WikiSummary } from "../patterns";

const filters: Array<TContributionStatus | "all"> = [
  "all",
  "pending",
  "approved",
  "declined",
  "abandoned",
];

export const ProfilePage = () => {
  const { t } = useTranslation("dashboard");
  return (
    <PageComponent.Dashboard
      title={t("profile.document.title")}
      description={t("profile.document.description")}
    >
      <Profile />
    </PageComponent.Dashboard>
  );
};

const Profile = () => {
  const { t } = useTranslation("dashboard");
  const user = useUser();
  const { push } = useRouter();
  const { data } = useContributions();
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const contributions = (data?.data ?? []).filter(
    (item) => filter === "all" || item.status === filter,
  );

  return (
    <Stack gap="xl">
      <Group gap="lg" align="flex-start">
        <Avatar src={user?.avatar} size="lg" />
        <Stack gap="xs">
          <Text fw={700} tt="capitalize">
            {user?.artistName}
          </Text>
          <Spoiler
            maxHeight={40}
            hideLabel={t("profile.showLess")}
            showLabel={t("profile.showMore")}
          >
            <Text size="sm">{user?.bio}</Text>
          </Spoiler>
          <Group>
            <Button
              size="compact-sm"
              variant="subtle"
              leftSection={<WikiIcon name="edit" size="sm" />}
              onClick={() => push("/profile/edit")}
            >
              {t("profile.edit")}
            </Button>
            <Button
              size="compact-sm"
              variant="transparent"
              leftSection={<WikiIcon name="link" size="sm" />}
            >
              {t("profile.links")}
            </Button>
          </Group>
        </Stack>
      </Group>
      <Divider />
      <Group>
        {filters.map((item) => (
          <Button
            key={item}
            size="compact-xs"
            variant={filter === item ? "filled" : "outline"}
            onClick={() => setFilter(item)}
          >
            {t(`profile.${item}`)}
          </Button>
        ))}
      </Group>
      <Stack gap="sm">
        {contributions.map((item) => (
          <WikiSummary
            key={item.id}
            title={item.title}
            excerpt={item.excerpt}
            genre={item.genre}
            updatedAt={item.updatedAt}
            status={item.status}
            onClick={() => push(`/page/${item.wikiId}`)}
          />
        ))}
      </Stack>
    </Stack>
  );
};
