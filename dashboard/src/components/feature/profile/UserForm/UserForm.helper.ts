import * as Yup from "yup";

export const userFormInitialValues = {
  firstName: "",
  lastName: "",
  bio: "",
  avatar: null,
  nickName: "",
  genre: [],
  profession: [],
};

export const userFormValidationSchema = Yup.object({
  firstName: Yup.string(),
  lastName: Yup.string(),
  bio: Yup.string(),
});
