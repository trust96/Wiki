import type { HttpType } from "./constants";
import type { TWikiApiResponse } from "@wiki/api-contracts";

export type TWikiResponseData<T> = TWikiApiResponse<T>;

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
