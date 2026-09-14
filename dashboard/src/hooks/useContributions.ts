import { useContributionsQuery } from "@/services/contribution";
import { useUiStore } from "@/state/ui";

export const useContributions = () => {
  const token = useUiStore((state) => state.token);
  return useContributionsQuery(Boolean(token));
};
