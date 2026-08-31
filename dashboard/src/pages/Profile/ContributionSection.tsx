import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core";
import { semanticColor } from "@/theme";

export const ContributionSection = () => {
  return (
    <Stack>
      <Group>
        <Button size="compact-xs" variant="filled">
          All
        </Button>
        <Button variant="outline" size="compact-xs">
          Pending
        </Button>
        <Button variant="outline" size="compact-xs">
          Approvved
        </Button>
        <Button variant="outline" size="compact-xs">
          Declined ??
        </Button>
        <Button variant="outline" size="compact-xs">
          Abbandoned
        </Button>
      </Group>
      <Card>
        <Stack gap="sm">
          <Group align="center">
            <Text fw={"bold"} size="md" lh={1}>
              Salsa step
            </Text>
            <Badge size="sm" variant="dot" color={semanticColor.success} lh={1}>
              approved
            </Badge>
          </Group>
          <Text size="xs" lineClamp={4} mb={"md"}>
            The salsa step in house dance is a groovy forward‑and‑back foot
            pattern built on the signature house bounce. The dancer keeps a
            steady, relaxed rhythm, letting the knees soften and the body pulse
            gently with the beat. The movement alternates between a light
            forward tap and a light backward tap, each done without committing
            weight, creating a playful, syncopated feel.
          </Text>
          <Group justify="space-between">
            <Badge size="sm" radius={"xs"} variant="outline" color="yellow">
              House
            </Badge>
            <Text c="dimmed" size="xs">
              20 minutes ago
            </Text>
          </Group>
        </Stack>
      </Card>
    </Stack>
  );
};
