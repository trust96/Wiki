import { Image } from "@mantine/core";
import { WikiLink } from "../Link";
import { sizes } from "./Logo.utils";
import type { TLogoProps } from "./Logo.model";

const Logo = (props: TLogoProps) => {
  const { className, size = "md" } = props;
  return (
    <WikiLink href="/" className={className} td="none" c="inherit" display="inline-flex">
      <Image src="/logo.svg" w={sizes[size] ?? size} alt="logo" />
    </WikiLink>
  );
};

export default Logo;
