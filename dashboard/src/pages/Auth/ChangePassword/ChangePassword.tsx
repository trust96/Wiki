import { zod4Resolver } from "mantine-form-zod-resolver";
import { Button, PasswordInput, Stack } from "@mantine/core";
import {
  changePasswordInitialValues,
  changePasswordValidationSchema,
} from "./helper";
import { useForm } from "@mantine/form";

export const ChangePassword = (_) => {
  const { getInputProps, onSubmit, values } = useForm({
    initialValues: changePasswordInitialValues,
    validate: zod4Resolver(changePasswordValidationSchema),
  });

  return (
    <Stack>
      <form onSubmit={onSubmit(() => {})}>
        <Stack>
          <PasswordInput
            {...getInputProps("oldPassword")}
            w={"100%"}
            autoComplete="current-password"
            label={"Old password"}
          />
          <PasswordInput
            {...getInputProps("password")}
            w={"100%"}
            label={"New password"}
          />
          <PasswordInput
            {...getInputProps("confirmPassword")}
            w={"100%"}
            label={"Confirm new password"}
          />
        </Stack>
      </form>
      <Button>Change password</Button>
    </Stack>
  );
};
