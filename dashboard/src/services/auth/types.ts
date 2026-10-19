import type { TWikiResponseData } from "@/helper/request";
import type { TUser } from "@/services/schema";

export type { TUser } from "@/services/schema";

export type TApiUser = {
  id: string;
  email: string;
  name: string | null;
  surname: string | null;
  role: number | null;
  verifiedAt: string | null;
  bio?: string;
  avatar?: string;
};

export type TForgottenPasswordParams = {
  email: string;
};

export type TLoginParams = {
  email: string;
  password: string;
};

export type TSignupParams = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

export type TUpdateUserParams = {
  firstName?: string;
  lastName?: string;
  artistName?: string;
  bio?: string;
  avatar?: string;
  isOnboarded?: boolean;
};

export type TUserResponseData = TWikiResponseData<{ user: TUser } | null>;

export type TLoginResponseData = TWikiResponseData<{ user: TUser } | null>;
export type TSignupResponseData = TWikiResponseData<null>;
export type TUpdateUserResponseData = TUserResponseData;
export type TForgottenPasswordResponseData = TWikiResponseData<null>;
