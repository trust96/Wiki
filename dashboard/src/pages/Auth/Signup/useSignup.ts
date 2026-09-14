import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { signupInitialValues } from "./helper";
import { useRegisterMutation } from "@/services/auth/auth";
import { useRouter } from "@/hooks/useRouter";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import type { TSignupParams } from "@/services/auth/types";

export const useSignup = () => {
  const { push } = useRouter();
  const { mutateAsync: registerUser } = useRegisterMutation();
  const signupValidationSchema = useSignupValidationSchema();
  const { getInputProps, onSubmit } = useForm<TSignupParams>({
    initialValues: signupInitialValues,
    validate: zod4Resolver(signupValidationSchema),
  });

  const handleSubmit = onSubmit(async (values) => {
    const data = await registerUser({
      username: values.username,
      email: values.email,
      password: values.password,
    });

    if (!data.isSuccess) {
      return;
    }

    push("/auth/email_verification");
  });
  return { getInputProps, handleSubmit };
};

export const useSignupValidationSchema = () => {
  const { t } = useTranslation(["common", "signup"]);

  return z.object({
    email: z
      .string()
      .min(
        1,
        t("common:validation.required", {
          fieldName: t("signup:email"),
        }),
      )
      .email(),
    password: z.string().min(
      1,
      t("common:validation.required", {
        fieldName: t("signup:password"),
      }),
    ),
    username: z.string().min(
      1,
      t("common:validation.required", {
        fieldName: t("signup:username"),
      }),
    ),
  });
};
