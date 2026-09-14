import { Text } from "@mantine/core";
import { WikiLink } from "../Link";
import { appName } from "@/helper/constants";
import { sizes } from "./helper";

export type TLogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const Logo = (props: TLogoProps) => {
  const { className, size = "md" } = props;
  return (
    <WikiLink
      href="/"
      className={className}
      td="none"
      c="inherit"
      display="inline-flex"
      lh={1}
    >
      <Text component="span" fw={700} fz={sizes[size]} ff="inherit">
        {appName}
      </Text>
    </WikiLink>
  );
};

export default Logo;
