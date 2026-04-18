import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import {
  generateEmailOtpCode,
  getEmailOtpExpiryDate,
  getEmailOtpResendAvailableAt,
  hashEmailOtpCode,
  isValidEmailAddress,
  normalizeEmail,
} from "@/lib/email-otp";
import { createSignInOtpEmailHTML } from "@/lib/email-templates";
import { env } from "@/lib/env";

const resend = new Resend(env.AUTH_RESEND_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = normalizeEmail(typeof body?.email === "string" ? body.email : "");

    if (!isValidEmailAddress(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const now = new Date();
    const latestOtp = await db.emailOtp.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (latestOtp) {
      const resendAvailableAt = getEmailOtpResendAvailableAt(latestOtp.createdAt);

      if (resendAvailableAt > now) {
        return NextResponse.json(
          {
            error: "Please wait a moment before requesting another code.",
            resendAvailableAt: resendAvailableAt.toISOString(),
          },
          { status: 429 }
        );
      }
    }

    const code = generateEmailOtpCode();
    const expiresAt = getEmailOtpExpiryDate();

    await db.emailOtp.updateMany({
      where: {
        email,
        consumedAt: null,
      },
      data: {
        consumedAt: now,
      },
    });

    const otp = await db.emailOtp.create({
      data: {
        email,
        codeHash: hashEmailOtpCode(email, code),
        expiresAt,
      },
    });

    try {
      await resend.emails.send({
        from: env.EMAIL_FROM,
        to: email,
        subject: `Your CollabBoard verification code: ${code}`,
        html: createSignInOtpEmailHTML(code),
      });
    } catch (error) {
      await db.emailOtp.delete({ where: { id: otp.id } });
      throw error;
    }

    return NextResponse.json({
      success: true,
      email,
      expiresAt: expiresAt.toISOString(),
      resendAvailableAt: getEmailOtpResendAvailableAt(now).toISOString(),
    });
  } catch (error) {
    console.error("Failed to send sign-in code:", error);
    return NextResponse.json(
      { error: "We couldn't send a sign-in code right now. Please try again." },
      { status: 500 }
    );
  }
}
