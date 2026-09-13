import { readFile } from "fs/promises";
import { putObject } from "./s3";
import { getUuid } from "./uuid";

export const saveImage = async (userId: string, file: any) => {
  if (!file) return null;
  const fileBuffer = await readFile(file.path);
  const key = `${userId}/${getUuid()}`;
  await putObject(key, fileBuffer);
  return key;
};
