import { normalizeBaseQuery } from "@/helper/normalizeBaseQuery";
import { useQuery } from "@tanstack/react-query";

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

export const pagesKey = ["pages"] as const;
export const pageKey = (id: number) => ["page", id] as const;

export const usePagesQuery = (enabled = true) =>
  useQuery({
    queryKey: pagesKey,
    queryFn: () =>
      normalizeBaseQuery<TPage[]>({
        url: "/pages",
        method: "GET",
      }),
    enabled,
  });

export const useSinglePageQuery = (id: number, enabled = true) =>
  useQuery({
    queryKey: pageKey(id),
    queryFn: () =>
      normalizeBaseQuery<TPage>({
        url: `/pages/${id}`,
        method: "GET",
      }),
    enabled,
  });
