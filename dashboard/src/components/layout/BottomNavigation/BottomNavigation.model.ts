import type { MaterialSymbol } from "material-symbols";
import type { MouseEventHandler } from "react";

export type TBottomNavigationProps = {
  items: TBottomNavigationItem[];
};

export type TBottomNavigationItem = {
  handleClick?: MouseEventHandler;
  icon: MaterialSymbol;
  href: string;
};
