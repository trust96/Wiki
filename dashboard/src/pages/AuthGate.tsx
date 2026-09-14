import { useUser } from "@/hooks/useUser";
import { useRouter } from "@/hooks/useRouter";
import { useUiStore } from "@/state/ui";
import { useEffect } from "react";
import { Outlet } from "react-router";

export const AuthGate = () => {
  const token = useUiStore((state) => state.token);
  const user = useUser();
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (!token || !user) return;
    if (!user.isOnboarded && pathname !== "/onboarding") {
      push("/onboarding");
      return;
    }
    if (
      user.isOnboarded &&
      (pathname === "/onboarding" || pathname.startsWith("/auth"))
    ) {
      push("/home");
    }
  }, [token, user, pathname, push]);

  return <Outlet />;
};
