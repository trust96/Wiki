import { tokenKey } from "@/helper/constants";
import { useCurrentUserQuery } from "@/services/auth/auth";
import { useUiStore } from "@/state/ui";
import type { ReactNode } from "react";
import { Redirect, useLocation } from "wouter";
import { guestRedirect, sessionRedirect } from "./authPath";

const useSession = () => {
  const token = useUiStore((state) => state.token);
  const removeToken = useUiStore((state) => state.removeToken);
  const { data, isPending } = useCurrentUserQuery(Boolean(token));
  const mePending = Boolean(token) && isPending;
  const user = data?.data?.user;
  const clearSession = () => {
    localStorage.removeItem(tokenKey);
    removeToken();
  };
  return { token, user, mePending, clearSession };
};

export const GuestGate = ({ children }: { children: ReactNode }) => {
  const { token, user, mePending, clearSession } = useSession();
  const to = guestRedirect(token, user, mePending);
  if (mePending) return null;
  if (token && !user) {
    clearSession();
    return children;
  }
  if (to) return <Redirect to={`~${to}`} replace />;
  return children;
};

export const AuthGate = ({ children }: { children: ReactNode }) => {
  const [pathname] = useLocation();
  const { token, user, mePending, clearSession } = useSession();
  const to = sessionRedirect(token, user, mePending, pathname);
  if (mePending) return null;
  if (token && !user) {
    clearSession();
    return <Redirect to="/auth/login" replace />;
  }
  if (to) return <Redirect to={to} replace />;
  return children;
};
