import { createApi } from "@reduxjs/toolkit/query/react";
import { normalizeBaseQuery } from "@/helper/normalizeBaseQuery";

export const pageApi = createApi({
  reducerPath: "pageApi",
  baseQuery: normalizeBaseQuery,
  endpoints: () => ({}),
});

export const {} = pageApi;
