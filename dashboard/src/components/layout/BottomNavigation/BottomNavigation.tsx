import { Flex, Paper } from "@mantine/core";
import { WikiLink, WikiIcon } from "@/components/primitive";
import { navigationData } from "@/helper/navigationData";
import { useRouter } from "@/hooks/useRouter";

const BottomNavigation = () => {
  const pathname = useRouter().pathname;
  return (
    <Paper>
      <Flex h="var(--wiki-footer-height)" wrap="nowrap">
        {navigationData.map((d) => {
          const isActive = pathname === d.href;
          const color = isActive
            ? "violet"
            : "var(--mantine-color-default-foreground)";
          const icon = (
            <WikiIcon
              isOutlined={!isActive}
              size={d.size}
              name={d.icon}
              color={isActive ? "violet" : undefined}
            />
          );
          if (d.href) {
            return (
              <WikiLink
                key={d.id}
                href={d.href}
                flex={1}
                h="100%"
                td="none"
                c={d.isDisabled ? "dimmed" : color}
                bg={
                  isActive
                    ? "var(--mantine-color-default-hover)"
                    : "transparent"
                }
                display="flex"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: d.isDisabled ? "none" : undefined,
                }}
              >
                {icon}
              </WikiLink>
            );
          }
          return (
            <Flex
              key={d.id}
              flex={1}
              h="100%"
              align="center"
              justify="center"
              c="dimmed"
            >
              {icon}
            </Flex>
          );
        })}
      </Flex>
    </Paper>
  );
};

export default BottomNavigation;
