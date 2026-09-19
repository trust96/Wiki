import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { forgottenPasswordInitialValues } from "./helper";
import type { TForgottenPasswordParams } from "@/services/auth/types";
import { useForgotPasswordMutation } from "@/services/auth/auth";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useForgottenPassword = () => {
  const { t } = useTranslation(["common", "forgotten_password"]);
  const [sent, setSent] = useState(false);
  const { mutateAsync: forgot } = useForgotPasswordMutation();
  const forgottenPasswordValidationSchema = z.object({
    email: z
      .string()
      .min(
        1,
        t("common:validation.required", {
          fieldName: t("forgotten_password:email"),
        }),
      )
      .email(),
  });

  const { getInputProps, onSubmit } = useForm<TForgottenPasswordParams>({
    initialValues: forgottenPasswordInitialValues,
    validate: zod4Resolver(forgottenPasswordValidationSchema),
  });
  const handleSubmit = onSubmit(async (values) => {
    const data = await forgot({ email: values.email });
    if (!data.isSuccess) return;
    setSent(true);
  });
  return { getInputProps, handleSubmit, sent };
};
