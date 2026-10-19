import { tokenKey } from "@/helper/constants";
import { normalizeBaseQuery } from "@/helper/normalizeBaseQuery";
import type { TUser } from "@/services/schema";
import { useUiStore } from "@/state/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  TApiUser,
  TLoginParams,
  TLoginResponseData,
  TSignupResponseData,
  TUpdateUserParams,
  TUserResponseData,
} from "./types";

export const currentUserKey = ["me"] as const;

const roleName = (role: number | null) => {
  if (role === 100) return "admin";
  if (role === 250) return "moderator";
  return "user";
};

export const toAppUser = (user: TApiUser): TUser => ({
  id: user.id,
  email: user.email,
  username: user.email,
  artistName: user.name ?? "",
  firstName: user.name ?? "",
  lastName: user.surname ?? "",
  bio: user.bio ?? "",
  avatar: user.avatar ?? "",
  isOnboarded: Boolean(user.name),
  role: roleName(user.role),
  emailVerifiedAt: user.verifiedAt,
});

const userFromApi = (
  response: TWikiResponse<TApiUser>,
): TUserResponseData => {
  if (!response.isSuccess || !response.data) {
    return { isSuccess: response.isSuccess, code: response.code, data: null };
  }
  return {
    isSuccess: true,
    code: null,
    data: { user: toAppUser(response.data) },
  };
};

type TWikiResponse<T> = {
  isSuccess: boolean;
  code: number | null;
  data: T | null;
};

export const useCurrentUserQuery = (enabled = true) => {
  const id = useUiStore((state) => state.token);
  return useQuery({
    queryKey: currentUserKey,
    queryFn: async () => {
      const response = await normalizeBaseQuery<TApiUser>({
        url: `/user/${id}`,
        method: "GET",
      });
      return userFromApi(response);
    },
    enabled: enabled && Boolean(id),
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TUpdateUserParams) => {
      const id = localStorage.getItem(tokenKey);
      const cached = queryClient.getQueryData<TUserResponseData>(currentUserKey);
      return normalizeBaseQuery<TApiUser>({
        url: `/user/${id}`,
        method: "PUT",
        payload: {
          name: payload.artistName || payload.firstName || "",
          surname: payload.lastName ?? "",
          email: cached?.data?.user?.email,
          bio: payload.bio,
        },
      }).then(userFromApi);
    },
    onSuccess: (result) => {
      if (!result.isSuccess || !result.data) return;
      queryClient.setQueryData(currentUserKey, result);
    },
  });
};

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      normalizeBaseQuery<TSignupResponseData["data"]>({
        url: "/auth/register",
        method: "POST",
        payload,
      }),
  });

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (payload: TLoginParams): Promise<TLoginResponseData> => {
      const response = await normalizeBaseQuery<TApiUser>({
        url: "/auth/login",
        method: "POST",
        payload: { email: payload.email, password: payload.password },
      });
      return userFromApi(response);
    },
  });

export const useLogoutMutation = () =>
  useMutation({
    mutationFn: () =>
      normalizeBaseQuery<null>({
        url: "/auth/logout",
        method: "POST",
      }),
  });

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: (payload: { email: string }) =>
      normalizeBaseQuery<null>({
        url: "/auth/forgotten_password",
        method: "POST",
        payload,
      }),
  });

export const useResetPasswordMutation = () =>
  useMutation({
    mutationFn: (payload: { code: string; password: string }) =>
      normalizeBaseQuery<null>({
        url: `/auth/change_forgotten_password/${payload.code}`,
        method: "POST",
        payload: { password: payload.password },
      }),
  });
