import { useSinglePageQuery } from "@/services/page";
import { useUiStore } from "@/state/ui";

export const useSinglePage = (id: number) => {
  const token = useUiStore((state) => state.token);
  return useSinglePageQuery(id, Boolean(token) && Boolean(id));
};
