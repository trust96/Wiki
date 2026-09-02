import { createApi } from "@reduxjs/toolkit/query/react";
import { normalizeBaseQuery } from "@/helper/normalizeBaseQuery";
import { HttpType } from "@/helper/constants";

export const fileApi = createApi({
  reducerPath: "fileApi",
  baseQuery: normalizeBaseQuery,
  endpoints: (builder) => ({
    upload: builder.mutation<any, any>({
      query: (payload) => {
        return {
          url: `/upload`,
          method: "POST",
          payload,
          type: HttpType.File,
        };
      },
    }),
  }),
});

export const { useUploadMutation } = fileApi;
