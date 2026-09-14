import { usePagesQuery } from "@/services/page";
import { useUiStore } from "@/state/ui";

export const usePage = () => {
  const token = useUiStore((state) => state.token);
  return usePagesQuery(Boolean(token));
};
