import { normalizeBaseQuery } from "@/helper/normalizeBaseQuery";
import { useQuery } from "@tanstack/react-query";
import type { TNotification } from "@/services/schema";

export const notificationsKey = ["notifications"] as const;

export const useNotificationsQuery = (enabled = true) =>
  useQuery({
    queryKey: notificationsKey,
    queryFn: () =>
      normalizeBaseQuery<TNotification[]>({
        url: "/notifications",
        method: "GET",
      }),
    enabled,
  });
