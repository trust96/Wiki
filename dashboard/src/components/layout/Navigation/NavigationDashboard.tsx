import { Card, Group } from "@mantine/core";
import { WikiLogo } from "@/components/primitive";
import NavigationMenu from "./NavigationMenu";

const NavigationDashboard = () => {
  return (
    <Card p={0}>
      <Group
        justify="space-between"
        align="center"
        wrap="nowrap"
        px="sm"
        h="var(--wiki-nav-height)"
      >
        <WikiLogo />
        <NavigationMenu />
      </Group>
    </Card>
  );
};

export default NavigationDashboard;
