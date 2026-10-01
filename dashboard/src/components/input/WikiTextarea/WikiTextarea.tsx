import { Textarea, type TextareaProps } from "@mantine/core";

export type TWikiTextareaProps = {
  maxLength: number;
} & TextareaProps;

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
