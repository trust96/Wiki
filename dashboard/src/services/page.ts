import { normalizeBaseQuery } from "@/helper/normalizeBaseQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TSection, TWiki } from "@/services/schema";

export type { TSection as TPageSection, TWiki as TPage } from "@/services/schema";

export const pagesKey = ["pages"] as const;
export const pageKey = (id: number) => ["page", id] as const;

export const usePagesQuery = (enabled = true) =>
  useQuery({
    queryKey: pagesKey,
    queryFn: () =>
      normalizeBaseQuery<TWiki[]>({
        url: "/pages",
        method: "GET",
      }),
    enabled,
  });

export const useSinglePageQuery = (id: number, enabled = true) =>
  useQuery({
    queryKey: pageKey(id),
    queryFn: () =>
      normalizeBaseQuery<TWiki>({
        url: `/pages/${id}`,
        method: "GET",
      }),
    enabled,
  });

export const useUpdateSectionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      pageId: number;
      sectionId: number;
      content: string;
    }) =>
      normalizeBaseQuery<TSection>({
        url: `/pages/${payload.pageId}/sections/${payload.sectionId}`,
        method: "PUT",
        payload: { content: payload.content },
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: pageKey(variables.pageId) });
      queryClient.invalidateQueries({ queryKey: pagesKey });
    },
  });
};
