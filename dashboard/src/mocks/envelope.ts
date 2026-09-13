import { HttpResponse } from "msw";

export const ok = (data: unknown = null, status = 200) =>
  HttpResponse.json({ isSuccess: true, code: null, data }, { status });

export const fail = (code: number, status = 200) =>
  HttpResponse.json({ isSuccess: false, code, data: null }, { status });
