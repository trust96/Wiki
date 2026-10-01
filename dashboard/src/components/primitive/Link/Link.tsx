import { Anchor, type AnchorProps } from "@mantine/core";
import type { ReactNode } from "react";
import { Link as WouterLink } from "wouter";

export type TLinkProps = Omit<AnchorProps, "href" | "component"> & {
  href: string;
  children: ReactNode;
};

const WikiLink = ({ href, children, ...rest }: TLinkProps) => {
  return (
    <WouterLink href={href} asChild>
      <Anchor {...rest}>{children}</Anchor>
    </WouterLink>
  );
};

export default WikiLink;
