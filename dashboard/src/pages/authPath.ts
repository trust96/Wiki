import type { TUser } from "@/services/schema";

export const guestRedirect = (
  token: string,
  user: TUser | undefined,
  mePending: boolean,
): string | null => {
  if (!token || mePending) return null;
  if (!user) return "/auth/login";
  return user.isOnboarded ? "/home" : "/onboarding";
};

export const sessionRedirect = (
  token: string,
  user: TUser | undefined,
  mePending: boolean,
  pathname: string,
): string | null => {
  if (!token) return "/auth/login";
  if (mePending) return null;
  if (!user) return "/auth/login";
  if (!user.isOnboarded && pathname !== "/onboarding") return "/onboarding";
  if (user.isOnboarded && pathname === "/onboarding") return "/home";
  return null;
};

export const entryRedirect = (
  token: string,
  user: TUser | undefined,
  mePending: boolean,
): string | null => {
  if (mePending) return null;
  if (!token || !user) return "/auth/login";
  return user.isOnboarded ? "/home" : "/onboarding";
};
