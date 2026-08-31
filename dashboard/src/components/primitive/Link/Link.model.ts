import type { AnchorProps } from "@mantine/core";
import type { ReactNode } from "react";

export type TLinkProps = Omit<AnchorProps, "href" | "component"> & {
  href: string;
  children: ReactNode;
};
