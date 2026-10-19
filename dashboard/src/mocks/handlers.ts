import {
  currentUser,
  forgottenPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
} from "./auth.handler";
import {
  contributions,
  notifications,
  pages,
  singlePage,
  translations,
  updateSection,
  upload,
} from "./content.handler";

export const handlers = [
  loginUser,
  registerUser,
  currentUser,
  updateUser,
  logoutUser,
  forgottenPassword,
  resetPassword,
  pages,
  singlePage,
  contributions,
  notifications,
  updateSection,
  translations,
  upload,
];
