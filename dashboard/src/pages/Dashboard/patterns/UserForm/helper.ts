import { z } from "zod";

export const userFormInitialValues = {
  firstName: "",
  lastName: "",
  bio: "",
  avatar: null,
  nickName: "",
  genre: [],
  profession: [],
};

export const userFormValidationSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string(),
});
