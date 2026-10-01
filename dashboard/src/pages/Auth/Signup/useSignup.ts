import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { signupInitialValues } from "./helper";
import { useRegisterMutation } from "@/services/auth/auth";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import type { TSignupParams } from "@/services/auth/types";
import { useLocation } from "wouter";

export const useSignup = () => {
  const [, navigate] = useLocation();
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
      confirmPassword: values.confirmPassword,
      terms: values.terms,
    });

    if (!data.isSuccess) {
      return;
    }

    navigate("~/auth/email_verification", { state: { email: values.email } });
  });
  return { getInputProps, handleSubmit };
};

export const useSignupValidationSchema = () => {
  const { t } = useTranslation(["common", "signup"]);
  const required = (fieldName: string) =>
    t("common:validation.required", { fieldName });

  return z
    .object({
      email: z
        .string()
        .min(1, required(t("signup:email")))
        .email(),
      username: z.string().min(1, required(t("signup:username"))),
      password: z
        .string()
        .min(1, required(t("signup:password")))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
          t("signup:validation.password"),
        ),
      confirmPassword: z
        .string()
        .min(1, required(t("signup:confirm_password"))),
      terms: z
        .boolean()
        .refine((value) => value, t("signup:validation.terms")),
    })
    .refine((values) => values.password === values.confirmPassword, {
      path: ["confirmPassword"],
      message: t("signup:validation.confirm"),
    });
};
