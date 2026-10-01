import { normalizeBaseQuery } from "@/helper/normalizeBaseQuery";
import { useQuery } from "@tanstack/react-query";
import type { TContribution } from "@/services/schema";

export const contributionsKey = ["contributions"] as const;

export const useContributionsQuery = (enabled = true) =>
  useQuery({
    queryKey: contributionsKey,
    queryFn: () =>
      normalizeBaseQuery<TContribution[]>({
        url: "/contributions",
        method: "GET",
      }),
    enabled,
  });
