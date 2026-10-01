import { zod4Resolver } from "mantine-form-zod-resolver";
import { Button, PasswordInput, Stack } from "@mantine/core";
import {
  changePasswordInitialValues,
  changePasswordValidationSchema,
  toChangePasswordRequest,
} from "./helper";
import { useForm } from "@mantine/form";

export const ChangePassword = () => {
  const { getInputProps, onSubmit } = useForm<typeof changePasswordInitialValues>({
    initialValues: changePasswordInitialValues,
    validate: zod4Resolver(changePasswordValidationSchema),
  });

  const handleSubmit = onSubmit((values) => {
    // Wire payload matches BE changePasswordRequestSchema when mutation is connected.
    void toChangePasswordRequest(values);
  });

  return (
    <Stack>
      <form onSubmit={handleSubmit}>
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
