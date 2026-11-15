import { USER_ROLE } from "../../helper/constants";
export type TUserResponseData = {
  id: string;
  email: string;
  surname: string;
  name: string;
  role: USER_ROLE;
  password?: string;
  verifiedAt?: string;
  bannedAt?: string;
};
