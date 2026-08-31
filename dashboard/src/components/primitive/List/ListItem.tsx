import { Box, Group } from "@mantine/core";
import type { TListItemProps } from "./List.model";

export const WikiListItem = ({
  children,
  isActive,
  leftSection,
  rightSection,
  onClick,
}: TListItemProps) => {
  return (
    <Group
      component="li"
      wrap="nowrap"
      gap="xs"
      px="xs"
      align="stretch"
      bd="0 0 1px 0 var(--mantine-color-default-border)"
      bg={isActive ? "var(--mantine-primary-color-filled)" : undefined}
      style={{ cursor: onClick ? "pointer" : undefined }}
      data-active={isActive || undefined}
    >
      {leftSection ? <Box>{leftSection}</Box> : null}
      <Box flex={1} miw={0} py="xs" onClick={onClick}>
        {children}
      </Box>
      {rightSection ? <Box>{rightSection}</Box> : null}
    </Group>
  );
};
