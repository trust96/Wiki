import { randomBytes } from "crypto";

export const getUuid = (length?: number) => {
  const randomString = randomBytes(16).toString("hex");
  if (length) {
    return randomString.slice(0, length);
  }
  return randomString;
};
