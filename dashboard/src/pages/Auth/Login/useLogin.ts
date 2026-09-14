import { useRouter } from "@/hooks/useRouter";
import { useLoginMutation } from "@/services/auth/auth";
import type { TLoginParams } from "@/services/auth/types";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { loginInitialValues, loginValidationSchema } from "./helper";

export const useLogin = () => {
  const { getInputProps, onSubmit } = useForm<TLoginParams>({
    initialValues: loginInitialValues,
    validate: zod4Resolver(loginValidationSchema),
  });
  const { push } = useRouter();
  const { mutateAsync: login } = useLoginMutation();
  const handleSubmit = onSubmit(async (values) => {
    const data = await login(values);
    if (!data.isSuccess) {
      return;
    }
    push("/home");
  });
  return {
    getInputProps,
    handleSubmit,
  };
};
