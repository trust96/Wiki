import { Box, Flex } from "@mantine/core";
import { WikiLink, WikiIcon } from "@/components/primitive";
import { useRouter } from "@/hooks/useRouter";
import { PRIMARY_COLOR } from "@/theme";
import type { TSidebarItemProps } from "./Sidebar.model";

const SidebarItem = (props: TSidebarItemProps) => {
  const { href, handleClick, isDisabled } = props;
  const pathname = useRouter().pathname;
  const isActive = pathname === props.href;
  const color = isActive ? PRIMARY_COLOR : "inherit";

  const icon = (
    <WikiIcon
      isOutlined={!isActive}
      name={props.icon}
      size={props.size}
      color={isActive ? PRIMARY_COLOR : undefined}
    />
  );

  return (
    <Box
      component="li"
      onClick={handleClick}
      bg={isActive ? "var(--mantine-color-default-hover)" : undefined}
    >
      {href ? (
        <WikiLink
          href={href}
          display="flex"
          p="md"
          c={isDisabled ? "dimmed" : color}
          td="none"
          style={{
            justifyContent: "center",
            pointerEvents: isDisabled ? "none" : undefined,
          }}
        >
          {icon}
        </WikiLink>
      ) : (
        <Flex p="md" justify="center" c="dimmed">
          {icon}
        </Flex>
      )}
    </Box>
  );
};

export default SidebarItem;
