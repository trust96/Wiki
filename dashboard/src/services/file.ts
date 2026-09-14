import { HttpType } from "@/helper/constants";
import { normalizeBaseQuery } from "@/helper/normalizeBaseQuery";
import { useMutation } from "@tanstack/react-query";

export const useUploadMutation = () =>
  useMutation({
    mutationFn: (payload: { files: File } & object) =>
      normalizeBaseQuery<{ url?: string }>({
        url: "/upload",
        method: "POST",
        payload,
        type: HttpType.File,
      }),
  });
