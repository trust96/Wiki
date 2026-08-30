import { createApi } from "@reduxjs/toolkit/query/react";
import { normalizeBaseQuery } from "@/helper/normalizeBaseQuery";

export const fileApi = createApi({
  reducerPath: "fileApi",
  baseQuery: normalizeBaseQuery,
  endpoints: () => ({}),
});

export const {} = fileApi;
