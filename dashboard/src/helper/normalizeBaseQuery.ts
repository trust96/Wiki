import type { TRequest, TWikiResponseData } from "@/helper/request";
import { useUiStore } from "@/state/ui";
import {
  baseUrl,
  HttpType,
  imageCompressionOptions,
  tokenKey,
} from "./constants";
import { toFormData } from "./toFormData";
import imageCompression from "browser-image-compression";

const failed = <T>(): TWikiResponseData<T> => ({
  isSuccess: false,
  code: null,
  data: null as T,
});

export const normalizeBaseQuery = async <T>(
  args: TRequest,
): Promise<TWikiResponseData<T>> => {
  const { url, payload, method, type } = args;
  const { addLoader, removeLoader, addApiError } = useUiStore.getState();

  try {
    addLoader();

    let body;
    if (type === HttpType.File) {
      const { files, ...rest } = payload as { files: File } & object;
      const compressedFiles = await imageCompression(
        files,
        imageCompressionOptions,
      );

      body = toFormData({
        ...rest,
        files: compressedFiles,
      });
    } else if (payload !== undefined) {
      body = JSON.stringify(payload);
    }

    const auth = localStorage.getItem(tokenKey);
    const headers = new Headers();

    if (auth) {
      headers.append("Authorization", `Bearer ${auth}`);
    }

    if (!type) {
      headers.append("Content-type", "application/json; charset=UTF-8");
    }

    const response = await fetch(`${baseUrl}${url}`, {
      body,
      method,
      headers,
    });

    const responseData = (await response.json()) as TWikiResponseData<T>;

    if (!responseData.isSuccess) {
      addApiError({
        status: response.status !== 200 ? response.status : null,
        code: responseData.code,
      });
    }

    return responseData;
  } catch {
    addApiError({
      status: 500,
      code: null,
    });
    return failed<T>();
  } finally {
    removeLoader();
  }
};
