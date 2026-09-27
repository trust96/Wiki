import { currentUserKey, useLoginMutation } from "@/services/auth/auth";
import type { TLoginParams } from "@/services/auth/types";
import { tokenKey } from "@/helper/constants";
import { useUiStore } from "@/state/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useLocation } from "wouter";
import { loginInitialValues, loginValidationSchema } from "./helper";

export const useLogin = () => {
  const { getInputProps, onSubmit } = useForm<TLoginParams>({
    initialValues: loginInitialValues,
    validate: zod4Resolver(loginValidationSchema),
  });
  const [, navigate] = useLocation();
  const addToken = useUiStore((state) => state.addToken);
  const clearApiErrors = useUiStore((state) => state.clearApiErrors);
  const queryClient = useQueryClient();
  const { mutateAsync: login } = useLoginMutation();
  const handleSubmit = onSubmit(async (values) => {
    const data = await login(values);
    if (data.code === 101) {
      clearApiErrors();
      navigate("~/auth/email_verification", {
        replace: true,
        state: { email: values.identifier },
      });
      return;
    }
    if (!data.isSuccess || !data.data) {
      return;
    }
    localStorage.setItem(tokenKey, data.data.token);
    addToken(data.data.token);
    queryClient.setQueryData(currentUserKey, {
      isSuccess: true,
      code: null,
      data: { user: data.data.user },
    });
    if (!data.data.user.isOnboarded) {
      navigate("~/onboarding");
      return;
    }
    navigate("~/home");
  });
  return {
    getInputProps,
    handleSubmit,
  };
};
