import { createApi } from "@reduxjs/toolkit/query/react";
import { normalizeBaseQuery } from "@/helper/normalizeBaseQuery";
import type { TWikiResponseData } from "@/model/baseQuery.model";

export type TPageSection = {
  id: number;
  title: string;
  content: string;
  order: number;
};

export type TPage = {
  id: number;
  title: string;
  description?: string;
  sections?: TPageSection[];
  updatedAt?: string;
};

export const pageApi = createApi({
  reducerPath: "pageApi",
  baseQuery: normalizeBaseQuery,
  endpoints: (builder) => ({
    pages: builder.query<TWikiResponseData<TPage[]>, void>({
      query: () => {
        return {
          url: "/pages",
          method: "GET",
        };
      },
    }),
    singlePage: builder.query<TWikiResponseData<TPage>, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/pages/${id}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { usePagesQuery, useSinglePageQuery } = pageApi;
