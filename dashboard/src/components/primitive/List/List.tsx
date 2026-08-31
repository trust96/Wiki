import { Stack } from "@mantine/core";
import type { TListProps } from "./List.model";
import styles from "./List.module.css";

export const WikiList = ({ children, isHoverable }: TListProps) => {
  return (
    <Stack
      component="ul"
      gap={0}
      p={0}
      m={0}
      className={styles.list}
      style={{ listStyle: "none" }}
      data-hoverable={isHoverable || undefined}
    >
      {children}
    </Stack>
  );
};
