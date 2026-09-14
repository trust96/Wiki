import { normalizeBaseQuery } from "@/helper/normalizeBaseQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  TLoginParams,
  TLoginResponseData,
  TSignupParams,
  TSignupResponseData,
  TUpdateUserParams,
  TUpdateUserResponseData,
  TUserResponseData,
} from "./types";

export const currentUserKey = ["me"] as const;

export const useCurrentUserQuery = () =>
  useQuery({
    queryKey: currentUserKey,
    queryFn: () =>
      normalizeBaseQuery<TUserResponseData["data"]>({
        url: "/auth/me",
        method: "GET",
      }),
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
    mutationFn: (payload: TSignupParams) =>
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
