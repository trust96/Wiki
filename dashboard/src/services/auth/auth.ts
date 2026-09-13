import { createApi } from "@reduxjs/toolkit/query/react";
import { normalizeBaseQuery } from "@/helper/normalizeBaseQuery";
import type {
  TLoginParams,
  TLoginResponseData,
  TSignupParams,
  TSignupResponseData,
  TUpdateUserParams,
  TUpdateUserResponseData,
  TUserResponseData,
} from "./auth.model";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: normalizeBaseQuery,
  tagTypes: ["CurrentUser"],
  endpoints: (builder) => ({
    currentUser: builder.query<TUserResponseData, void>({
      query: () => {
        return {
          url: "/auth/me",
          method: "GET",
        };
      },
      providesTags: ["CurrentUser"],
    }),
    // The server resolves the user from the token, so no id goes in the url.
    updateUser: builder.mutation<
      TUpdateUserResponseData,
      TUpdateUserParams
    >({
      query: (payload) => {
        return {
          url: "/users/me",
          method: "PUT",
          payload,
        };
      },
      invalidatesTags: ["CurrentUser"],
    }),
    register: builder.mutation<TSignupResponseData, TSignupParams>({
      query: (payload) => {
        return {
          url: "/auth/register",
          method: "POST",
          payload,
        };
      },
    }),
    login: builder.mutation<TLoginResponseData, TLoginParams>({
      query: (payload) => {
        return {
          url: "/auth/login",
          method: "POST",
          payload,
        };
      },
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useRegisterMutation,
  useLoginMutation,
  useCurrentUserQuery,
} = authApi;
