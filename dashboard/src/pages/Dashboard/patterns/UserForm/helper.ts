import { onboardingParamsSchema } from "@/services/schema";
import { z } from "zod";

export const userFormInitialValues = {
  artistName: "",
  firstName: "",
  lastName: "",
  bio: "",
  avatar: null as File | null,
};

export const userFormValidationSchema = onboardingParamsSchema
  .omit({ avatar: true })
  .extend({
    avatar: z.instanceof(File).nullable(),
  });
