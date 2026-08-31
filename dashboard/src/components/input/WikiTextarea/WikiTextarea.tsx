import { Textarea } from "@mantine/core";
import type { TWikiTextareaProps } from "./WikiTextarea.model";

export const WikiTextarea = ({ maxLength, value, ...props }: TWikiTextareaProps) => {
  const length = String(value ?? "").length;
  return (
    <Textarea
      {...props}
      value={value}
      maxLength={maxLength}
      description={`${length}/${maxLength}`}
      inputWrapperOrder={["label", "input", "description", "error"]}
      styles={{
        description: { textAlign: "right", fontWeight: 700 },
      }}
    />
  );
};
