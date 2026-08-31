import { Stack, Title, Button, Text, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import {
  resetPasswordInitialValues,
  resetPasswordValidationSchema,
} from "./ResetPassword.helper";

export const ResetPassword = () => {
  const { getInputProps, onSubmit, errors } = useForm({
    initialValues: resetPasswordInitialValues,
    validate: yupResolver(resetPasswordValidationSchema),
  });

  return (
    <>
      <Stack align="center">
        <Title order={2} ta={"center"}>
          Reset Password
        </Title>
        <Text ta={"center"}>
          Please check your email to verify your account. If you did not receive
          the email, please check your spam folder or click the button below to
          resend the verification email.
        </Text>
        <form style={{ width: "100%" }} onSubmit={onSubmit(() => {})}>
          <Stack align="center">
            <PasswordInput
              {...getInputProps("password")}
              w={"100%"}
              autoComplete="current-password"
              error={errors.password}
              label={"Password"}
            />
            <PasswordInput
              {...getInputProps("confirmPassword")}
              w={"100%"}
              autoComplete="current-password"
              error={errors.password}
              label={"Confirm password"}
            />
            <Button fullWidth>Continue</Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
};
