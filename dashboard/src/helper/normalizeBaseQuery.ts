import type { TRequest, TWikiResponseData } from "@/helper/request";
import { useUiStore } from "@/state/ui";
import { baseUrl, HttpType, imageCompressionOptions } from "./constants";
import { toFormData } from "./toFormData";
import imageCompression from "browser-image-compression";

type TWireResponse<T> = {
  ok?: boolean;
  isSuccess?: boolean;
  code?: number | null;
  data?: T;
};

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

    const headers = new Headers();

    if (!type) {
      headers.append("Content-type", "application/json; charset=UTF-8");
    }

    const response = await fetch(`${baseUrl}${url}`, {
      body,
      method,
      headers,
      credentials: "include",
    });

    const wire = (await response.json()) as TWireResponse<T>;
    const responseData: TWikiResponseData<T> = {
      isSuccess: wire.ok ?? wire.isSuccess ?? false,
      code: wire.code ?? null,
      data: (wire.data ?? null) as T,
    };

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
