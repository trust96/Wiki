import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from "node:crypto";
import { setTimeout as sleep } from "node:timers/promises";
import nodemailer from "nodemailer";
import type { AuthTokenPurpose, Prisma, User } from "../../generated/prisma/client";
import { ApiError } from "../../helper/api";
import { apiConfig } from "../../helper/config";
import { emailKey } from "../../helper/identity";
import prisma from "../../helper/prisma";
import logger from "../../helper/logger";
import { activeAccount, lockAccount } from "./auth.session";

const mail = apiConfig.mail;
const minute = 60_000;
export const tokenHash = (value: string) => createHash("sha256").update(value).digest("hex");

export function requireMailConfiguration() {
  if (!mail.host || !mail.from || !mail.verificationUrl || !mail.resetUrl || !mail.encryptionKey || (!!mail.user !== !!mail.password)) {
    throw new ApiError("INTERNAL_ERROR");
  }
}

function encrypt(value: string) {
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(mail.encryptionKey!, "hex"), nonce);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return Buffer.concat([nonce, cipher.getAuthTag(), ciphertext]);
}

function decrypt(value: Uint8Array, keyId: string | null) {
  if (keyId !== mail.encryptionKeyId) throw new ApiError("INTERNAL_ERROR");
  const buffer = Buffer.from(value);
  const decipher = createDecipheriv("aes-256-gcm", Buffer.from(mail.encryptionKey!, "hex"), buffer.subarray(0, 12));
  decipher.setAuthTag(buffer.subarray(12, 28));
  return Buffer.concat([decipher.update(buffer.subarray(28)), decipher.final()]).toString("utf8");
}

export async function enqueueMailRequest(email: string, purpose: AuthTokenPurpose) {
  requireMailConfiguration();
  await prisma.authMailOutbox.create({
    data: { payloadCiphertext: encrypt(JSON.stringify({ email, purpose })), encryptionKeyId: mail.encryptionKeyId },
  });
}

export async function cancelTokenMail(tx: Prisma.TransactionClient, userId: string, purpose: AuthTokenPurpose, now = new Date()) {
  await tx.authToken.updateMany({ where: { userId, purpose, consumedAt: null, revokedAt: null }, data: { revokedAt: now } });
  await tx.authMailOutbox.updateMany({
    where: { token: { userId, purpose }, status: { in: ["PENDING", "PROCESSING"] } },
    data: { status: "CANCELLED", payloadCiphertext: null, encryptionKeyId: null, lockId: null, lockedUntil: null },
  });
}

// The caller holds the account row lock, serializing suppression and token replacement.
export async function scheduleTokenMail(tx: Prisma.TransactionClient, user: User, purpose: AuthTokenPurpose) {
  requireMailConfiguration();
  const now = new Date();
  const recent = await tx.authToken.findMany({
    where: { userId: user.id, purpose, issuedAt: { gt: new Date(now.getTime() - 60 * minute) } },
    select: { issuedAt: true },
    orderBy: { issuedAt: "desc" },
    take: 5,
  });
  if (recent.length >= 5 || (recent[0] && now.getTime() - recent[0].issuedAt.getTime() < minute)) return false;

  await cancelTokenMail(tx, user.id, purpose, now);
  const token = randomBytes(32).toString("base64url");
  await tx.authToken.create({
    data: {
      userId: user.id, email: user.email, purpose, tokenHash: tokenHash(token), issuedAt: now,
      expiresAt: new Date(now.getTime() + (purpose === "EMAIL_VERIFICATION" ? 24 * 60 : 30) * minute),
      mail: { create: { payloadCiphertext: encrypt(token), encryptionKeyId: mail.encryptionKeyId } },
    },
  });
  return true;
}

export async function runMailWorker(signal: AbortSignal) {
  requireMailConfiguration();
  const transport = nodemailer.createTransport({
    host: mail.host, port: mail.port, secure: mail.secure,
    requireTLS: apiConfig.nodeEnv === "production",
    auth: mail.user ? { user: mail.user, pass: mail.password } : undefined,
    connectionTimeout: 5000, greetingTimeout: 5000, socketTimeout: 10_000,
    logger: false, debug: false,
  });
  let nextReceiptCleanup = 0;
  try {
    while (!signal.aborted) {
      try {
        const now = new Date();
        if (now.getTime() >= nextReceiptCleanup) {
          await prisma.authMailOutbox.deleteMany({
            where: { tokenId: null, status: "CANCELLED", createdAt: { lt: new Date(now.getTime() - 24 * 60 * minute) } },
          });
          nextReceiptCleanup = now.getTime() + 60 * minute;
        }
        const job = await prisma.authMailOutbox.findFirst({
          where: {
            availableAt: { lte: now },
            OR: [{ status: "PENDING" }, { status: "PROCESSING", lockedUntil: { lte: now } }],
          },
          include: { token: true },
          orderBy: { availableAt: "asc" },
        });
        if (!job) {
          await sleep(1000, undefined, { signal });
          continue;
        }
        const lockId = randomUUID();
        const claim = await prisma.authMailOutbox.updateMany({
          where: { id: job.id, OR: [{ status: "PENDING" }, { status: "PROCESSING", lockedUntil: { lte: now } }] },
          data: { status: "PROCESSING", lockId, lockedUntil: new Date(now.getTime() + 90_000), lastAttemptAt: now, attempts: { increment: 1 } },
        });
        if (!claim.count) continue;
        try {
          await prisma.$transaction(async (tx) => {
            if (!job.token) {
              if (!job.payloadCiphertext) throw new ApiError("INTERNAL_ERROR");
              const request: { email: string; purpose: AuthTokenPurpose } = JSON.parse(decrypt(job.payloadCiphertext, job.encryptionKeyId));
              const candidate = await tx.user.findUnique({ where: { emailKey: emailKey(request.email) }, select: { id: true } });
              const user = candidate ? await lockAccount(tx, candidate.id) : null;
              const current = await tx.authMailOutbox.findUnique({ where: { id: job.id } });
              if (!current || current.lockId !== lockId || current.status !== "PROCESSING") return;
              if (activeAccount(user) && (request.purpose === "PASSWORD_RESET" || !user.emailVerifiedAt)) {
                await scheduleTokenMail(tx, user, request.purpose);
              }
              await tx.authMailOutbox.update({
                where: { id: job.id },
                data: { status: "CANCELLED", payloadCiphertext: null, encryptionKeyId: null, lockId: null, lockedUntil: null },
              });
              return;
            }
            const user = await lockAccount(tx, job.token.userId);
            const current = await tx.authMailOutbox.findUnique({ where: { id: job.id }, include: { token: true } });
            if (!current || current.lockId !== lockId || current.status !== "PROCESSING") return;
            const token = current.token;
            if (!token || !activeAccount(user) || user.email !== token.email || token.consumedAt || token.revokedAt || token.expiresAt <= new Date() ||
              (token.purpose === "EMAIL_VERIFICATION" && user.emailVerifiedAt)) {
              await tx.authMailOutbox.update({
                where: { id: job.id },
                data: { status: "CANCELLED", payloadCiphertext: null, encryptionKeyId: null, lockId: null, lockedUntil: null },
              });
              return;
            }
            if (!current.payloadCiphertext) throw new ApiError("INTERNAL_ERROR");
            const rawToken = decrypt(current.payloadCiphertext, current.encryptionKeyId);
            if (tokenHash(rawToken) !== token.tokenHash) throw new ApiError("INTERNAL_ERROR");
            const link = new URL(token.purpose === "EMAIL_VERIFICATION" ? mail.verificationUrl! : mail.resetUrl!);
            link.hash = `token=${encodeURIComponent(rawToken)}`;
            const info = await transport.sendMail({
              from: mail.from,
              to: token.email,
              messageId: `<${job.id}@wiki-auth.invalid>`,
              subject: token.purpose === "EMAIL_VERIFICATION" ? "Verify your email" : "Reset your password",
              text: `${token.purpose === "EMAIL_VERIFICATION" ? "Verify your email" : "Reset your password"}:\n${link.toString()}\n\nThis link expires at ${token.expiresAt.toISOString()}.`,
            });
            if (!info.accepted?.length) throw new ApiError("INTERNAL_ERROR");
            await tx.authMailOutbox.update({
              where: { id: job.id },
              data: { status: "SENT", sentAt: new Date(), payloadCiphertext: null, encryptionKeyId: null, lockId: null, lockedUntil: null },
            });
          }, { timeout: 45_000 });
        } catch {
          await prisma.authMailOutbox.updateMany({
            where: { id: job.id, lockId, status: "PROCESSING" },
            data: {
              status: "PENDING", lockId: null, lockedUntil: null,
              availableAt: new Date(Date.now() + Math.min(300_000, 1000 * 2 ** Math.min(job.attempts + 1, 8))),
            },
          });
          logger.warn("Auth mail delivery deferred for retry.");
        }
      } catch {
        if (!signal.aborted) {
          logger.error("Auth mail worker could not process pending work.");
          await sleep(1000, undefined, { signal }).catch(() => {});
        }
      }
    }
  } finally {
    transport.close();
  }
}
