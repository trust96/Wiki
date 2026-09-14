import { getAuthToken } from "@/helper/getAuthToken";
import type { TApiError } from "@/helper/request";
import { create } from "zustand";

type TUiStore = {
  loaders: number;
  token: string;
  apiErrors: TApiError[];
  addLoader: () => void;
  removeLoader: () => void;
  addToken: (token: string) => void;
  removeToken: () => void;
  addApiError: (error: TApiError) => void;
  clearApiErrors: () => void;
};

export const useUiStore = create<TUiStore>((set) => ({
  loaders: 0,
  token: getAuthToken() ?? "",
  apiErrors: [],
  addLoader: () => set((state) => ({ loaders: state.loaders + 1 })),
  removeLoader: () => set((state) => ({ loaders: state.loaders - 1 })),
  addToken: (token) => set({ token }),
  removeToken: () => set({ token: "" }),
  addApiError: (error) =>
    set((state) => ({ apiErrors: [...state.apiErrors, error] })),
  clearApiErrors: () => set({ apiErrors: [] }),
}));
