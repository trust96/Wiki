import { yupResolver } from "mantine-form-yup-resolver";
import { useForm } from "@mantine/form";
import { Stack, TextInput } from "@mantine/core";
import {
  userFormInitialValues,
  userFormValidationSchema,
} from "./UserForm.helper";
import { useEffect } from "react";
import { useRouter } from "@/hooks/useRouter";
import { useUpdateUserMutation } from "@/services/auth/auth";
import { useUploadMutation } from "@/services/file";
import { useUser } from "@/hooks/useUser";
import { WikiTextarea } from "@/components/input";

export const UserForm = () => {
  const { setValues, getInputProps, onSubmit, values } =
    useForm<typeof userFormInitialValues>({
      initialValues: userFormInitialValues,
      validate: yupResolver(userFormValidationSchema),
    });
  const user = useUser();
  useEffect(() => {
    if (user?.id) {
      setValues({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        nickName: user?.nickname || "",
        avatar: null,
        bio: user?.bio,
      });
    }
  }, [user?.id]);
  const { push } = useRouter();
  const [updateUser] = useUpdateUserMutation();
  const [uploadFile] = useUploadMutation();
  const handleSubmit = onSubmit(async (data: typeof values) => {
    try {
      let avatar: string | undefined;
      if (data?.avatar) {
        const upload = await uploadFile({ files: data.avatar });
        avatar = upload?.data?.url;
      }

      await updateUser({
        firstName: data.firstName,
        lastName: data.lastName,
        nickname: data.nickName,
        bio: data.bio,
        ...(avatar ? { avatar } : {}),
      });
    } catch (error) {
      console.log(error);
    } finally {
      push("/profile");
    }
  });

  return (
    <form onSubmit={handleSubmit} id="onboarding-form">
      <Stack gap="xl">
        <TextInput
          {...getInputProps("firstName")}
          label="What is your first name?"
        />
        <TextInput
          {...getInputProps("lastName")}
          label="What is your last name?"
        />
        <TextInput
          {...getInputProps("nickName")}
          label="What is your artist name?"
        />
        <WikiTextarea
          label="Tell us about yourself"
          maxLength={500}
          rows={5}
          {...getInputProps("bio")}
        />
      </Stack>
    </form>
  );
};
