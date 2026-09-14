import { AvatarField } from "../AvatarField";
import { WikiTextarea } from "@/components/input";
import { useRouter } from "@/hooks/useRouter";
import { useUser } from "@/hooks/useUser";
import { useUpdateUserMutation } from "@/services/auth/auth";
import { useUploadMutation } from "@/services/file";
import { Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { userFormInitialValues, userFormValidationSchema } from "./helper";

const formId = "user-form";

type TUserFormProps = {
  nextPath?: string;
};

export const UserForm = ({ nextPath = "/home" }: TUserFormProps) => {
  const { t } = useTranslation("dashboard");
  const user = useUser();
  const { push } = useRouter();
  const { mutateAsync: updateUser } = useUpdateUserMutation();
  const { mutateAsync: uploadFile } = useUploadMutation();
  const { setValues, getInputProps, onSubmit, values } = useForm<
    typeof userFormInitialValues
  >({
    initialValues: userFormInitialValues,
    validate: zod4Resolver(userFormValidationSchema),
  });

  useEffect(() => {
    if (!user?.id) return;
    setValues({
      artistName: user.artistName,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      avatar: null,
    });
  }, [user?.id]);

  const preview =
    values.avatar instanceof File
      ? URL.createObjectURL(values.avatar)
      : user?.avatar;

  const handleSubmit = onSubmit(async () => {
    let avatar = user?.avatar;
    if (values.avatar instanceof File) {
      const upload = await uploadFile({ files: values.avatar });
      avatar = upload.data?.url ?? avatar;
    }
    const result = await updateUser({
      artistName: values.artistName,
      firstName: values.firstName,
      lastName: values.lastName,
      bio: values.bio,
      ...(avatar ? { avatar } : {}),
      isOnboarded: true,
    });
    if (result.isSuccess) {
      push(nextPath);
    }
  });

  return (
    <form onSubmit={handleSubmit} id={formId}>
      <Stack gap="xl">
        <Stack gap="xs">
          <Title order={2}>{t("onboarding.heading")}</Title>
          <Text c="dimmed">{t("onboarding.subtitle")}</Text>
        </Stack>
        <AvatarField
          src={preview}
          onChange={(file) => setValues({ avatar: file })}
        />
        <TextInput
          {...getInputProps("artistName")}
          label={t("onboarding.artistName")}
          required
        />
        <Stack gap="sm">
          <Text fw={700}>{t("onboarding.private")}</Text>
          <Text c="dimmed" size="sm">
            {t("onboarding.privateNote")}
          </Text>
          <TextInput
            {...getInputProps("firstName")}
            label={t("onboarding.firstName")}
            required
          />
          <TextInput
            {...getInputProps("lastName")}
            label={t("onboarding.lastName")}
            required
          />
        </Stack>
        <WikiTextarea
          label={t("onboarding.bio")}
          maxLength={300}
          rows={5}
          {...getInputProps("bio")}
        />
      </Stack>
    </form>
  );
};
