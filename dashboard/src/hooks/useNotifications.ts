import { useNotificationsQuery } from "@/services/notification";
import { useUiStore } from "@/state/ui";

export const useNotifications = () => {
  const token = useUiStore((state) => state.token);
  return useNotificationsQuery(Boolean(token));
};
