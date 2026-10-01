export enum EAppMode {
  Development = "development",
  Production = "production",
}

export const baseUrl = "http://localhost:3000/api";
// "https://api.dancediction.com/api";
//"https://incredible-purpose-39ec375761.strapiapp.com/api";
export const appName = "Wiki dance";
export enum AppModals {
  Login,
  Signup,
  Contact,
  ChangePassword,
}

export const API_TOKEN =
  "e131dfa1fa3936e1233821c4d6e59beb80699e38a356eca07b5f2efe961a8ab5e04d30876d9e9b3457992b16d4ee1fcd8b349aaf9bdd631556898c3a777bc971b8d436e98f990dd8da1a0f7c255debfe95bc467d4756129f0c3aa0458f2dad396802c556d5b611ec2b5214cefc32f47069b931f4b835af6e4e8f01869572646b";
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
