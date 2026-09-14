import type { TWikiResponseData } from "@/helper/request";
import type { TUser } from "@/services/schema";

export type { TUser } from "@/services/schema";

export type TForgottenPasswordParams = {
  email: string;
};

export type TLoginParams = {
  identifier: string;
  password: string;
};

export type TSignupParams = {
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
  terms?: boolean;
};

export type TUpdateUserParams = {
  firstName?: string;
  lastName?: string;
  artistName?: string;
  bio?: string;
  avatar?: string;
  isOnboarded?: boolean;
};

export type TUserResponseData = TWikiResponseData<{ user: TUser }>;

export type TLoginResponseData = TWikiResponseData<{
  token: string;
  user: TUser;
}>;
export type TSignupResponseData = TUserResponseData;
export type TUpdateUserResponseData = TUserResponseData;
export type TForgottenPasswordResponseData = TWikiResponseData<null>;
