export enum EAppMode {
  Development = "development",
  Production = "production",
}

export const baseUrl = "http://localhost:3000/api";
export const appName = "Wiki dance";
export const enum EStoreSlice {
  Modal = "Modal",
  ApiError = "ApiError",
}
export enum AppModals {
  Login,
  Signup,
  Contact,
  ChangePassword,
}

export const defaultAppMode = EAppMode.Production;
export const appModeKey = "AppMode";
export const tokenKey = "appToken";
export enum HttpType {
  File = "File",
  Json = "Json",
}

export const imageCompressionOptions = {
  maxSizeMB: 5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

export const RESEND_EMAIL_DELAY = 2;
