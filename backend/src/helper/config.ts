import "dotenv/config";
import { isIP } from "node:net";
import { number, object, string, ValidationError } from "yup";

const isOrigin = (value: string, production: boolean): boolean => {
  try {
    const url = new URL(value);
    return url.origin === value && (production ? url.protocol === "https:" : ["http:", "https:"].includes(url.protocol));
  } catch {
    return false;
  }
};

const production = process.env.NODE_ENV === "production";
const trustedProxy = (value: string) => {
  const [ip, bits, extra] = value.split("/");
  const version = isIP(ip);
  return !!version && extra === undefined && (bits === undefined || (/^\d+$/.test(bits) && Number(bits) <= (version === 4 ? 32 : 128)));
};
const httpsLink = () => string().optional().test("https-link", "Configure an HTTPS frontend URL without query or fragment.", (value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash;
  } catch {
    return false;
  }
});
const schema = object({
  nodeEnv: string().oneOf(["development", "test", "production"]).required(),
  origins: string()
    .required()
    .test("origins", "Configure explicit app/site origins.", (value) => !!value && value.split(",").every((origin) => isOrigin(origin.trim(), production))),
  sessionSecret: string()
    .required()
    .test("secret", "Configure a production session secret.", (value) => !production || (!!value && value.length >= 32 && !["default_secret", "change-me"].includes(value))),
  termsVersion: string().optional(),
  trustedProxies: string().defined().test("proxies", "Configure exact trusted proxy IPs or CIDRs.", (value) => !value || value.split(",").every((part) => trustedProxy(part.trim()))),
  smtpHost: string().optional(),
  smtpPort: number().integer().min(1).max(65535).required(),
  smtpSecure: string().oneOf(["true", "false"]).required(),
  smtpUser: string().optional(),
  smtpPassword: string().optional(),
  mailFrom: string().email().optional(),
  verificationUrl: httpsLink(),
  resetUrl: httpsLink(),
  mailEncryptionKey: string().optional().matches(/^[a-fA-F0-9]{64}$/, "Configure a 32-byte hex outbox encryption key."),
  mailEncryptionKeyId: string().required(),
});

function readConfig() {
  try {
    const values = schema.validateSync({
      nodeEnv: process.env.NODE_ENV ?? "development",
      origins: process.env.CORS_ORIGIN ?? (production ? undefined : "http://localhost:3000"),
      sessionSecret: process.env.TOKEN_SECRET ?? (production ? undefined : "default_secret"),
      termsVersion: process.env.TERMS_VERSION || undefined,
      trustedProxies: process.env.TRUSTED_PROXIES ?? "",
      smtpHost: process.env.SMTP_HOST || undefined,
      smtpPort: Number(process.env.SMTP_PORT ?? 587),
      smtpSecure: process.env.SMTP_SECURE ?? "false",
      smtpUser: process.env.SMTP_USER || undefined,
      smtpPassword: process.env.SMTP_PASSWORD || undefined,
      mailFrom: process.env.MAIL_FROM || undefined,
      verificationUrl: process.env.FRONTEND_VERIFICATION_URL || undefined,
      resetUrl: process.env.FRONTEND_RESET_URL || undefined,
      mailEncryptionKey: process.env.MAIL_ENCRYPTION_KEY || undefined,
      mailEncryptionKeyId: process.env.MAIL_ENCRYPTION_KEY_ID || "v1",
    }, { abortEarly: false, strict: true });
    return Object.freeze({
      nodeEnv: values.nodeEnv,
      origins: Object.freeze(values.origins.split(",").map((origin) => origin.trim())),
      sessionSecret: values.sessionSecret,
      termsVersion: values.termsVersion,
      trustedProxies: values.trustedProxies ? values.trustedProxies.split(",").map((part) => part.trim()) : false,
      mail: Object.freeze({
        host: values.smtpHost, port: values.smtpPort, secure: values.smtpSecure === "true",
        user: values.smtpUser, password: values.smtpPassword, from: values.mailFrom,
        verificationUrl: values.verificationUrl, resetUrl: values.resetUrl,
        encryptionKey: values.mailEncryptionKey, encryptionKeyId: values.mailEncryptionKeyId,
      }),
    });
  } catch (error) {
    if (!(error instanceof ValidationError)) throw error;
    const fields = [...new Set(error.inner.map((issue) => issue.path))].join(", ");
    throw new Error(`Invalid backend configuration: ${fields}.`);
  }
}

export const apiConfig = readConfig();
