import type { EmailConfig } from "next-auth/providers/email";
import { Resend } from "resend";
import { env } from "./env";

const resend = new Resend(env.AUTH_RESEND_KEY);

// Clean light blue email template
const createEmailTemplate = (title: string, message: string, buttonText: string, buttonUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #e3f2fd;">
  <div style="max-width: 500px; margin: 40px auto; background-color: #e3f2fd; border-radius: 12px; overflow: hidden;">
    
    <!-- Content -->
    <div style="padding: 40px 32px; text-align: center;">
      <h1 style="color: #002984; font-size: 28px; font-weight: 600; margin: 0 0 8px 0; letter-spacing: -0.025em;">CollabBoard</h1>
      
      <h2 style="color: #1565c0; font-size: 20px; font-weight: 500; margin: 0 0 24px 0;">${title}</h2>
      
      <p style="color: #1976d2; font-size: 16px; margin: 0 0 32px 0; line-height: 1.5;">
        ${message}
      </p>
      
      <a href="${buttonUrl}" style="display: inline-block; background-color: #002984; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 500; margin-bottom: 32px;">
        ${buttonText}
      </a>
      
      <p style="color: #1976d2; font-size: 14px; margin: 0; line-height: 1.5; opacity: 0.8;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
    
  </div>
</body>
</html>
`;

// Clean and simple sign-in email template
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createSignInEmailHTML = (url: string, identifier: string) => createEmailTemplate(
  "Sign in to your account",
  "Click the button below to securely sign in to CollabBoard.",
  "Sign in to CollabBoard",
  url
);

// Clean and simple invitation email template  
export const createInvitationEmailHTML = (inviterName: string, organizationName: string, invitationUrl: string) => createEmailTemplate(
  `You're invited to join ${organizationName}!`,
  `${inviterName} has invited you to join their organization on CollabBoard.`,
  "Accept Invitation",
  invitationUrl
);


export function createCustomResendProvider(): EmailConfig {
  return {
    id: "resend",
    type: "email",
    name: "Resend",
    from: env.EMAIL_FROM,
    maxAge: 24 * 60 * 60, // 24 hours
    async sendVerificationRequest({ identifier: email, url }) {
      try {
        await resend.emails.send({
          from: env.EMAIL_FROM,
          to: email,
          subject: "Sign in to CollabBoard",
          html: createSignInEmailHTML(url, email),
          // attachments: [
          //   {
          //     path: "/Users/mayurbijarniya/Downloads/Code/collabboard/public/logo/collabboard.png",
          //     filename: "collabboard-logo.png",
          //     content: "collabboard-logo"
          //   }
          // ]
        });
      } catch (error) {
        console.error("Failed to send verification email:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        throw error;
      }
    },
  };
}