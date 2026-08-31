import type { ReactNode, MouseEventHandler } from "react";

export type TListSharedProps = {
  isHoverable?: boolean;
};

export type TListProps = {
  children: ReactNode;
} & TListSharedProps;

export type TListItemProps = {
  children: ReactNode;
  isActive?: boolean;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
};
