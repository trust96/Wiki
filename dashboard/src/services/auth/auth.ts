import { createApi } from "@reduxjs/toolkit/query/react";
import { normalizeBaseQuery } from "@/helper/normalizeBaseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: normalizeBaseQuery,
  endpoints: () => ({}),
});

export const {} = authApi;
