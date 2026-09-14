import { Avatar, FileInput, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";

type TAvatarFieldProps = {
  src?: string;
  onChange: (file: File | null) => void;
};

export const AvatarField = ({ src, onChange }: TAvatarFieldProps) => {
  const { t } = useTranslation("dashboard");
  return (
    <Group align="flex-end" gap="md">
      <Avatar src={src || undefined} size="lg" />
      <FileInput
        accept="image/*"
        onChange={onChange}
        placeholder={t("onboarding.photo")}
        flex={1}
      />
    </Group>
  );
};
