import type { TWikiResponseData } from "@/model/baseQuery.model";

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

export type TUser = {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  avatar?: string;
  bio?: string;
  role?: string;
  emailVerifiedAt?: string;
};

export type TUpdateUserParams = {
  firstName?: string;
  lastName?: string;
  nickname?: string;
  bio?: string;
  avatar?: string;
};

export type TUserResponseData = TWikiResponseData<{ user: TUser }>;

export type TLoginResponseData = TWikiResponseData<{
  token: string;
  user: TUser;
}>;
export type TSignupResponseData = TUserResponseData;
export type TUpdateUserResponseData = TUserResponseData;
export type TForgottenPasswordResponseData = TWikiResponseData<null>;
