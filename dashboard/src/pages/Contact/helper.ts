import { z } from "zod";

export const contactInitialValues = {
  type: "",
  subject: "",
  message: "",
};

export const contactValidationSchema = z.object({
  type: z.string().min(1, "Required"),
  subject: z.string().min(1, "Required"),
  message: z.string().min(1, "Required"),
});
