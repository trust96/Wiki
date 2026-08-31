import { type MaterialSymbol } from "material-symbols";
import { type MouseEventHandler } from "react";

export type TSidebarProps = {};
export type TSidebarItemProps = TSidebarItem;
export type TSidebarItem = {
  id: string;
  handleClick?: MouseEventHandler;
  icon: MaterialSymbol;
  href?: string;
  size?: number;
  isDisabled?: boolean;
};
