import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { trimUnicodeWhitespace, codePointLength } from "./identity";

const saltLength = 16;
const keyLength = 64;
const parameters = { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };
const prefix = "scrypt$v1$131072$8$1";

const derive = (password: string, salt: Buffer): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, parameters, (error, key) => (error ? reject(error) : resolve(key)));
  });

export async function hashPassword(value: string): Promise<string> {
  const password = trimUnicodeWhitespace(value);
  const length = codePointLength(password);
  if (length < 8 || length > 30) throw new Error("Password must contain 8-30 Unicode code points.");

  const salt = randomBytes(saltLength);
  const key = await derive(password, salt);
  return `${prefix}$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyPassword(value: string, encoded: string): Promise<boolean> {
  const match = /^scrypt\$v1\$131072\$8\$1\$([A-Za-z0-9_-]{22})\$([A-Za-z0-9_-]{86})$/.exec(encoded);
  if (!match) return false;

  const salt = Buffer.from(match[1], "base64url");
  const expected = Buffer.from(match[2], "base64url");
  if (salt.toString("base64url") !== match[1] || expected.toString("base64url") !== match[2]) return false;

  const actual = await derive(trimUnicodeWhitespace(value), salt);
  return timingSafeEqual(actual, expected);
}
