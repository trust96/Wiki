import { Anchor, type AnchorProps } from "@mantine/core";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router";

export type TLinkProps = Omit<AnchorProps, "href" | "component"> & {
  href: string;
  children: ReactNode;
};

const WikiLink = ({ href, children, ...rest }: TLinkProps) => {
  return (
    <Anchor component={RouterLink} to={href} {...rest}>
      {children}
    </Anchor>
  );
};

export default WikiLink;
