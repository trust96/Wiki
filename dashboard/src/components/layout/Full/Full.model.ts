import { type MouseEventHandler, type ReactNode } from "react";

export type TDirection = {
  icon?: ReactNode;
  text?: string;
  onClick?: MouseEventHandler;
  disabled?: boolean;
  form?: string;
};
export type TFull = {
  children: ReactNode;
  title?: string;
  left?: TDirection | ReactNode;
  right?: TDirection | ReactNode;
  back?: string;
  isDirty?: boolean;
  clear?: string;
  id?: string;
  noNav?: boolean;
};
