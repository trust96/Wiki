import {
  authStubHandlers,
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "./auth.handler";
import {
  pages,
  singlePage,
  translations,
  updateProfile,
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
  translations,
  upload,
];
