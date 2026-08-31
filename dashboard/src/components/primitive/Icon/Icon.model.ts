import type { MaterialSymbol } from "material-symbols";
import type { HtmlHTMLAttributes } from "react";

export type TIconProps = {
  name: MaterialSymbol;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  isClickable?: boolean;
  color?: string;
  isOutlined?: boolean;
} & HtmlHTMLAttributes<HTMLSpanElement>;
