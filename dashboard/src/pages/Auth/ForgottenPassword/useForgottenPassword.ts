import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { forgottenPasswordInitialValues } from "./helper";
import type { TForgottenPasswordParams } from "@/services/auth/types";
import { useForgotPasswordMutation } from "@/services/auth/auth";
import { useState } from "react";
import { forgottenPasswordRequestSchema } from "@wiki/api-contracts";

export const useForgottenPassword = () => {
  const [sent, setSent] = useState(false);
  const { mutateAsync: forgot } = useForgotPasswordMutation();

  const { getInputProps, onSubmit } = useForm<TForgottenPasswordParams>({
    initialValues: forgottenPasswordInitialValues,
    validate: zod4Resolver(forgottenPasswordRequestSchema),
  });
  const handleSubmit = onSubmit(async (values) => {
    const data = await forgot({ email: values.email });
    if (!data.ok) return;
    setSent(true);
  });
  return { getInputProps, handleSubmit, sent };
};
