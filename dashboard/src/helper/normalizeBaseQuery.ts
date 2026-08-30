import type { TBaseQueryFn } from "@/model/baseQuery.model";
import { baseUrl, HttpType, imageCompressionOptions } from "./constants";
import { addApiError } from "@/state/apiErrorSlice/apiErrorSlice";
import { addLoader, removeLoader } from "@/state/uiSlice/uiSlice";
import { toFormData } from "./toFormData";
import imageCompression from "browser-image-compression";

export const normalizeBaseQuery: TBaseQueryFn = async (args, { dispatch }) => {
  const { url, payload, method, type } = args;
  try {
    dispatch(addLoader());

    let body;
    if (type === HttpType.File) {
      const { files, ...rest } = payload as any;
      const compressedFiles = await imageCompression(
        files,
        imageCompressionOptions,
      );

      body = toFormData({
        ...rest,
        files: compressedFiles,
      });
    } else {
      body = JSON.stringify(payload);
    }

    let headers = new Headers();

    if (!type) {
      headers.append("Content-type", "application/json; charset=UTF-8");
    }

    const response = await fetch(`${baseUrl}${url}`, {
      body,
      method,
      headers: headers,
    });

    const responseData = await response.json();

    if (!responseData.isSuccess) {
      dispatch(
        addApiError({
          status: response?.status !== 200 ? response?.status : null,
          code: responseData?.code,
        }),
      );
    }

    return {
      data: responseData,
    };
  } catch (error) {
    dispatch(
      addApiError({
        status: 500,
        code: null,
      }),
    );

    return {
      error,
    };
  } finally {
    dispatch(removeLoader());
  }
};
