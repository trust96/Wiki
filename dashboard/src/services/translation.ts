import { createApi } from "@reduxjs/toolkit/query/react";
import { normalizeBaseQuery } from "@/helper/normalizeBaseQuery";

export const translationApi = createApi({
  reducerPath: "translationApi",
  baseQuery: normalizeBaseQuery,
  endpoints: () => ({}),
});

export const {} = translationApi;
