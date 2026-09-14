import { Avatar, FileInput, Group } from "@mantine/core";

type TAvatarFieldProps = {
  src?: string;
  onChange: (file: File | null) => void;
};

export const AvatarField = ({ src, onChange }: TAvatarFieldProps) => {
  return (
    <Group align="flex-end" gap="md">
      <Avatar src={src || undefined} size="lg" />
      <FileInput
        accept="image/*"
        onChange={onChange}
        placeholder="Optional photo"
        flex={1}
      />
    </Group>
  );
};
