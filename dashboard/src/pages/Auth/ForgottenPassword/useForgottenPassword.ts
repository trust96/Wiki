import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { forgottenPasswordInitialValues } from "./helper";
import type { TForgottenPasswordParams } from "@/services/auth/types";

export const useForgottenPassword = () => {
  const forgottenPasswordValidationSchema =
    useForgottenPasswordValidationSchema();

  const { getInputProps, onSubmit } = useForm<TForgottenPasswordParams>({
    initialValues: forgottenPasswordInitialValues,
    validate: zod4Resolver(forgottenPasswordValidationSchema),
  });
  const handleSubmit = onSubmit(async (values) => {
    //TODO: add logic for submit
  });
  return { getInputProps, handleSubmit };
};

const useForgottenPasswordValidationSchema = () => {
  return z.object({
    email: z.email("Required"),
  });
};
