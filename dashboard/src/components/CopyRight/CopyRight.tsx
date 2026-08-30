import { Text } from "@mantine/core";
import styles from "./CopyRight.module.css";
export const CopyRight = () => {
  return (
    <div className={styles.copy}>
      <Text c="dimmed" size="sm">
        © {new Date().getFullYear()} Wiki Dance. All rights reserved.
      </Text>
    </div>
  );
};
