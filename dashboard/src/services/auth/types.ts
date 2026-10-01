import type { TWikiResponseData } from "@/helper/request";
import type { TUser } from "@/services/schema";
import type {
  TLoginRequest,
  TRegisterRequest,
  TForgottenPasswordRequest,
  TChangeForgottenPasswordRequest,
  TChangePasswordRequest,
  TPublicUser,
} from "@wiki/api-contracts";

export type { TUser } from "@/services/schema";
export type {
  TPublicUser,
  TLoginRequest,
  TRegisterRequest,
  TForgottenPasswordRequest,
  TChangeForgottenPasswordRequest,
  TChangePasswordRequest,
};

export type TForgottenPasswordParams = TForgottenPasswordRequest;

export type TLoginParams = TLoginRequest;

export type TRegisterParams = TRegisterRequest;

/** UI-only signup form shape; wire payload is TRegisterParams. */
export type TSignupParams = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

/** FE/MSW profile update shape; not a BE /user contract yet. */
export type TUpdateUserParams = {
  firstName?: string;
  lastName?: string;
  artistName?: string;
  bio?: string;
  avatar?: string;
  isOnboarded?: boolean;
};

export type TResetPasswordParams = TChangeForgottenPasswordRequest & {
  token: string;
};

export type TUserResponseData = TWikiResponseData<{ user: TUser }>;

export type TLoginResponseData = TWikiResponseData<{
  token: string;
  user: TUser;
}>;
export type TSignupResponseData = TUserResponseData;
export type TUpdateUserResponseData = TUserResponseData;
export type TForgottenPasswordResponseData = TWikiResponseData<null>;
