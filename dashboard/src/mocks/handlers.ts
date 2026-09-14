import {
  authStubHandlers,
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "./auth.handler";
import {
  contributions,
  notifications,
  pages,
  singlePage,
  translations,
  updateProfile,
  updateSection,
  upload,
} from "./content.handler";

export const handlers = [
  loginUser,
  registerUser,
  currentUser,
  logoutUser,
  ...authStubHandlers,
  updateProfile,
  pages,
  singlePage,
  contributions,
  notifications,
  updateSection,
  translations,
  upload,
];
