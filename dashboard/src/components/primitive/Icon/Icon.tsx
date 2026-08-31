import { Box } from "@mantine/core";
import { forwardRef, type Ref } from "react";
import type { TIconProps } from "./Icon.model";
import { iconSizes } from "./Icon.helper";

const Icon = forwardRef((props: TIconProps, ref: Ref<HTMLSpanElement>) => {
  const { name, isOutlined = true, className, size, isClickable, color, style, ...rest } =
    props;
  const fill = isOutlined ? "0" : "1";
  const fontSize = typeof size === "number" ? size : iconSizes[size ?? "md"];

  return (
    <Box
      component="span"
      ref={ref}
      fz={fontSize}
      c={color}
      className={["material-symbols-outlined", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        cursor: isClickable ? "pointer" : "inherit",
        fontVariationSettings: `'FILL' ${fill} , 'wght' 400, 'GRAD' 0, 'opsz' 48`,
        ...style,
      }}
      {...rest}
    >
      {name}
    </Box>
  );
});

export default Icon;
