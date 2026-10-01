import {
  authStubHandlers,
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
  verifyEmail,
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
  verifyEmail,
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
