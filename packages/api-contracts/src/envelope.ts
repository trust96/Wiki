import { z } from "zod";

export const wikiApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    ok: z.boolean(),
    code: z.number().nullable(),
    data: dataSchema.nullable(),
  });

export type TWikiApiResponse<T> = {
  ok: boolean;
  code: number | null;
  data: T | null;
};
