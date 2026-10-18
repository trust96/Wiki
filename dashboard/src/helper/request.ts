import type { HttpType } from "./constants";

export type TWikiResponseData<T> = {
  code: number | null;
  isSuccess: boolean;
  data: T;
};

export type TApiError = {
  status: number | null;
  code: number | string | null;
};

export type TRequest = {
  payload?: object;
  method: "POST" | "GET" | "PUT" | "DELETE";
  url: string;
  type?: HttpType;
};
