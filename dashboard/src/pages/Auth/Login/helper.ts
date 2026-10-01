import { loginParamsSchema } from "@/services/schema";

export const loginInitialValues = {
  email: "",
  password: "",
} as const;

export const loginValidationSchema = loginParamsSchema;
