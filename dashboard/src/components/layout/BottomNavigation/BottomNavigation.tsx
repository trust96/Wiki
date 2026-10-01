import { Flex, Paper } from "@mantine/core";
import { WikiLink, WikiIcon } from "@/components/primitive";
import { navigationData } from "@/helper/navigationData";
import { PRIMARY_COLOR } from "@/foundations";
import { useRoute } from "wouter";

const BottomNavigation = () => {
  return (
    <Paper>
      <Flex h="var(--wiki-footer-height)" wrap="nowrap">
        {navigationData.map((item) => (
          <BottomNavItem key={item.id} {...item} />
        ))}
      </Flex>
    </Paper>
  );
};

const BottomNavItem = (item: (typeof navigationData)[number]) => {
  const [match] = useRoute(item.href ?? "/__none__");
  const isActive = Boolean(item.href) && match;
  const color = isActive
    ? PRIMARY_COLOR
    : "var(--mantine-color-default-foreground)";
  const icon = (
    <WikiIcon
      isOutlined={!isActive}
      size={item.size}
      name={item.icon}
      color={isActive ? PRIMARY_COLOR : undefined}
    />
  );
  if (item.href) {
    return (
      <WikiLink
        href={item.href}
        flex={1}
        h="100%"
        td="none"
        c={item.isDisabled ? "dimmed" : color}
        bg={isActive ? "var(--mantine-color-default-hover)" : "transparent"}
        display="flex"
        style={{
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: item.isDisabled ? "none" : undefined,
        }}
      >
        {icon}
      </WikiLink>
    );
  }
  return (
    <Flex flex={1} h="100%" align="center" justify="center" c="dimmed">
      {icon}
    </Flex>
  );
};

export default BottomNavigation;
