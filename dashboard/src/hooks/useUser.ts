import { useCurrentUserQuery } from "@/services/auth/auth";
import { useUiStore } from "@/state/ui";

export const useUser = () => {
  const token = useUiStore((state) => state.token);
  const { data } = useCurrentUserQuery(Boolean(token));
  return data?.data?.user;
};
