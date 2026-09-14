import type { TSignupParams } from "@/services/auth/types";

export const signupInitialValues: TSignupParams = {
  email: "",
  password: "",
  username: "",
  confirmPassword: "",
  terms: false,
};
