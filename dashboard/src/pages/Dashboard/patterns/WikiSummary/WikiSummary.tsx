import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import { primaryShade } from "@/foundations";
import type { TContributionStatus, TGenre } from "@/services/schema";
import { ContributionStatus } from "../ContributionStatus";

type TWikiSummaryProps = {
  title: string;
  excerpt?: string;
  genre: TGenre;
  updatedAt: string;
  status?: TContributionStatus;
  onClick?: () => void;
};

const timeAgo = (iso: string) => {
  const delta = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.round(delta / 60000));
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};

export const WikiSummary = ({
  title,
  excerpt,
  genre,
  updatedAt,
  status,
  onClick,
}: TWikiSummaryProps) => {
  return (
    <Card
      withBorder
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      <Stack gap="sm">
        <Group align="center">
          <Text fw={700} size="md" lh={1} c={primaryShade(5)}>
            {title}
          </Text>
          {status ? <ContributionStatus status={status} /> : null}
        </Group>
        {excerpt ? (
          <Text size="sm" lineClamp={4}>
            {excerpt}
          </Text>
        ) : null}
        <Group justify="space-between">
          <Badge size="sm" radius="xs" variant="outline">
            {genre}
          </Badge>
          <Text c="dimmed" size="xs">
            {timeAgo(updatedAt)}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
};
