import { normalizeBaseQuery } from "@/helper/normalizeBaseQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  TLoginParams,
  TLoginResponseData,
  TRegisterParams,
  TSignupResponseData,
  TUpdateUserParams,
  TUpdateUserResponseData,
  TUserResponseData,
  TForgottenPasswordParams,
  TResetPasswordParams,
  TChangeForgottenPasswordRequest,
} from "./types";

export const currentUserKey = ["me"] as const;

export const useCurrentUserQuery = (enabled = true) =>
  useQuery({
    queryKey: currentUserKey,
    queryFn: () =>
      normalizeBaseQuery<TUserResponseData["data"]>({
        url: "/auth/me",
        method: "GET",
      }),
    enabled,
  });

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TUpdateUserParams) =>
      normalizeBaseQuery<TUpdateUserResponseData["data"]>({
        url: "/users/me",
        method: "PUT",
        payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currentUserKey });
    },
  });
};

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: (payload: TRegisterParams) =>
      normalizeBaseQuery<TSignupResponseData["data"]>({
        url: "/auth/register",
        method: "POST",
        payload,
      }),
  });

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (payload: TLoginParams) =>
      normalizeBaseQuery<TLoginResponseData["data"]>({
        url: "/auth/login",
        method: "POST",
        payload,
      }),
  });

export const useVerifyEmailMutation = () =>
  useMutation({
    mutationFn: (payload: { token: string }) =>
      normalizeBaseQuery<TLoginResponseData["data"]>({
        url: "/auth/verify-email",
        method: "POST",
        payload,
      }),
  });

export const useResendVerificationMutation = () =>
  useMutation({
    mutationFn: (payload: { email: string }) =>
      normalizeBaseQuery<null>({
        url: "/auth/resend-verification",
        method: "POST",
        payload,
      }),
  });

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: (payload: TForgottenPasswordParams) =>
      normalizeBaseQuery<null>({
        url: "/auth/forgot-password",
        method: "POST",
        payload,
      }),
  });

export const useResetPasswordMutation = () =>
  useMutation({
    mutationFn: ({ token, ...body }: TResetPasswordParams) =>
      normalizeBaseQuery<null>({
        url: `/auth/change_forgotten_password/${encodeURIComponent(token)}`,
        method: "POST",
        payload: body satisfies TChangeForgottenPasswordRequest,
      }),
  });
