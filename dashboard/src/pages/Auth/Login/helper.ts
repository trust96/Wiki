import { loginParamsSchema } from "@/services/schema";

export const loginInitialValues = {
  identifier: "",
  password: "",
} as const;

export const loginValidationSchema = loginParamsSchema;
