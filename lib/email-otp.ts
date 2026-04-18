import { createHmac, randomInt } from "crypto";
import { env } from "./env";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

export const EMAIL_OTP_LENGTH = 6;
export const EMAIL_OTP_TTL_MS = 10 * 60 * 1000;
export const EMAIL_OTP_RESEND_COOLDOWN_MS = 60 * 1000;
export const EMAIL_OTP_MAX_ATTEMPTS = 5;
export const AUTH_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmailAddress(email: string): boolean {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || normalizedEmail.length < 5) return false;

  const atIndex = normalizedEmail.indexOf("@");
  if (
    atIndex < 1 ||
    atIndex === normalizedEmail.length - 1 ||
    normalizedEmail.indexOf("@", atIndex + 1) !== -1
  ) {
    return false;
  }

  if (
    normalizedEmail.includes("..") ||
    normalizedEmail.startsWith(".") ||
    normalizedEmail.endsWith(".") ||
    normalizedEmail.startsWith("@") ||
    normalizedEmail.endsWith("@")
  ) {
    return false;
  }

  return EMAIL_REGEX.test(normalizedEmail);
}

export function generateEmailOtpCode(): string {
  return randomInt(0, 10 ** EMAIL_OTP_LENGTH)
    .toString()
    .padStart(EMAIL_OTP_LENGTH, "0");
}

export function hashEmailOtpCode(email: string, code: string): string {
  return createHmac("sha256", env.AUTH_SECRET)
    .update(`${normalizeEmail(email)}:${code.trim()}`)
    .digest("hex");
}

export function getEmailOtpExpiryDate(): Date {
  return new Date(Date.now() + EMAIL_OTP_TTL_MS);
}

export function getEmailOtpResendAvailableAt(createdAt: Date): Date {
  return new Date(createdAt.getTime() + EMAIL_OTP_RESEND_COOLDOWN_MS);
}

export function getSafeRedirectPath(
  callbackUrl: string | undefined,
  requestUrl: string,
  fallback = "/dashboard"
): string {
  if (!callbackUrl) {
    return fallback;
  }

  if (callbackUrl.startsWith("/")) {
    return callbackUrl;
  }

  try {
    const baseUrl = new URL(requestUrl);
    const parsedUrl = new URL(callbackUrl);

    if (parsedUrl.origin === baseUrl.origin) {
      return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    }
  } catch {
    return fallback;
  }

  return fallback;
}
