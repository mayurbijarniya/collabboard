import type { EmailConfig } from "next-auth/providers/email";
import { Resend } from "resend";
import { env } from "./env";

const resend = new Resend(env.AUTH_RESEND_KEY);

// CollabBoard branded email template
const createEmailTemplate = (title: string, message: string, buttonText: string, buttonUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 520px; margin: 40px auto;">
    <!-- Logo Header -->
    <div style="text-align: center; padding: 32px 0 24px;">
      <span style="font-size: 24px; font-weight: 700; color: #2563eb;">CollabBoard</span>
    </div>

    <!-- Card -->
    <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">
      <!-- Header -->
      <div style="background-color: #f1f5f9; padding: 32px 40px 24px; text-align: center;">
        <h1 style="color: #0f172a; font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">${title}</h1>
      </div>

      <!-- Content -->
      <div style="padding: 32px 40px;">
        <p style="color: #475569; font-size: 16px; margin: 0 0 28px 0; line-height: 1.6;">
          ${message}
        </p>

        <!-- Button -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <a href="${buttonUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 500;">
                ${buttonText}
              </a>
            </td>
          </tr>
        </table>

        <!-- Divider -->
        <div style="margin: 28px 0; border-top: 1px solid #e2e8f0;"></div>

        <!-- Footer -->
        <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.5;">
          This link will expire in 24 hours.<br>
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    </div>

    <!-- Copyright -->
    <div style="text-align: center; padding: 24px 0;">
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">
        &copy; 2025 CollabBoard. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;

// Sign-in email template
const createSignInEmailHTML = (url: string, _identifier: string) => createEmailTemplate(
  "Sign in to your account",
  "Click the button below to securely sign in to CollabBoard.",
  "Sign in to CollabBoard",
  url
);

// Invitation email template
export const createInvitationEmailHTML = (inviterName: string, organizationName: string, invitationUrl: string) => createEmailTemplate(
  `You're invited to ${organizationName}`,
  `${inviterName} has invited you to join their team on CollabBoard. Click the button below to accept the invitation.`,
  "Accept Invitation",
  invitationUrl
);

export function createCustomResendProvider(): EmailConfig {
  return {
    id: "resend",
    type: "email",
    name: "Resend",
    from: env.EMAIL_FROM,
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest({ identifier: email, url }) {
      try {
        await resend.emails.send({
          from: env.EMAIL_FROM,
          to: email,
          subject: "Sign in to CollabBoard",
          html: createSignInEmailHTML(url, email),
        });
      } catch (error) {
        console.error("Failed to send verification email:", error);
        throw error;
      }
    },
  };
}
