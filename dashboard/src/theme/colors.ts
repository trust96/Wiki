import type { MantineColorsTuple } from "@mantine/core";

/**
 * Wiki brand purple. Maps site `--color-primary-50…900` onto Mantine shades 0–9.
 * `--color-primary-950` is exported separately as `brand950` (Mantine tuples are 10 stops).
 */
export const brand: MantineColorsTuple = [
  "#f5f3ff",
  "#ede9fe",
  "#ddd6fe",
  "#c4b5fd",
  "#a78bfa",
  "#8b5cf6",
  "#7c3aed",
  "#6d28d9",
  "#5b21b6",
  "#4c1d95",
];

export const brand950 = "#2e1065";

export const PRIMARY_COLOR = "brand" as const;

export const primaryShade = (shade: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) =>
  `${PRIMARY_COLOR}.${shade}` as const;
