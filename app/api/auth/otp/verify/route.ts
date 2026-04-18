import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionCookieName, shouldUseSecureAuthCookies } from "@/lib/auth-cookies";
import {
  AUTH_SESSION_TTL_MS,
  EMAIL_OTP_LENGTH,
  EMAIL_OTP_MAX_ATTEMPTS,
  getSafeRedirectPath,
  hashEmailOtpCode,
  isValidEmailAddress,
  normalizeEmail,
} from "@/lib/email-otp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = normalizeEmail(typeof body?.email === "string" ? body.email : "");
    const code = typeof body?.code === "string" ? body.code.replace(/\D/g, "") : "";
    const callbackUrl = typeof body?.callbackUrl === "string" ? body.callbackUrl : undefined;

    if (!isValidEmailAddress(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (code.length !== EMAIL_OTP_LENGTH) {
      return NextResponse.json(
        { error: `Enter the ${EMAIL_OTP_LENGTH}-digit code from your email.` },
        { status: 400 }
      );
    }

    const now = new Date();
    const otp = await db.emailOtp.findFirst({
      where: {
        email,
        consumedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) {
      return NextResponse.json(
        { error: "This code is no longer valid. Request a new code and try again." },
        { status: 400 }
      );
    }

    if (otp.expiresAt <= now) {
      await db.emailOtp.update({
        where: { id: otp.id },
        data: { consumedAt: now },
      });

      return NextResponse.json(
        { error: "This code has expired. Request a new code and try again." },
        { status: 400 }
      );
    }

    if (otp.attemptCount >= EMAIL_OTP_MAX_ATTEMPTS) {
      await db.emailOtp.update({
        where: { id: otp.id },
        data: { consumedAt: now },
      });

      return NextResponse.json(
        { error: "Too many incorrect attempts. Request a new code to continue." },
        { status: 400 }
      );
    }

    if (otp.codeHash !== hashEmailOtpCode(email, code)) {
      const nextAttemptCount = otp.attemptCount + 1;

      await db.emailOtp.update({
        where: { id: otp.id },
        data: {
          attemptCount: {
            increment: 1,
          },
          ...(nextAttemptCount >= EMAIL_OTP_MAX_ATTEMPTS ? { consumedAt: now } : {}),
        },
      });

      return NextResponse.json(
        {
          error:
            nextAttemptCount >= EMAIL_OTP_MAX_ATTEMPTS
              ? "Too many incorrect attempts. Request a new code to continue."
              : "That code is incorrect. Please try again.",
        },
        { status: 400 }
      );
    }

    const sessionToken = randomUUID();
    const sessionExpires = new Date(Date.now() + AUTH_SESSION_TTL_MS);
    const redirectTo = getSafeRedirectPath(callbackUrl, request.url);

    await db.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: "insensitive",
          },
        },
      });

      const user = existingUser
        ? existingUser.emailVerified
          ? existingUser
          : await tx.user.update({
              where: { id: existingUser.id },
              data: { emailVerified: now },
            })
        : await tx.user.create({
            data: {
              email,
              emailVerified: now,
            },
          });

      await tx.emailOtp.update({
        where: { id: otp.id },
        data: { consumedAt: now },
      });

      await tx.session.create({
        data: {
          sessionToken,
          userId: user.id,
          expires: sessionExpires,
        },
      });
    });

    const response = NextResponse.json({
      success: true,
      redirectTo,
    });

    const secureCookies = shouldUseSecureAuthCookies(request);

    response.cookies.set(getSessionCookieName(request), sessionToken, {
      expires: sessionExpires,
      httpOnly: true,
      secure: secureCookies,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Failed to verify sign-in code:", error);
    return NextResponse.json(
      { error: "We couldn't verify that code right now. Please try again." },
      { status: 500 }
    );
  }
}
