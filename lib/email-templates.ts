const createEmailTemplate = (
  title: string,
  message: string,
  contentHtml: string,
  footerHtml: string
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${title}</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }

    @media screen and (max-width: 600px) {
      .email-shell {
        margin: 24px auto !important;
      }

      .email-header,
      .email-content {
        padding: 24px 20px !important;
      }

      .email-title {
        font-size: 22px !important;
      }

      .email-message {
        font-size: 15px !important;
      }

      .otp-box {
        font-size: 28px !important;
        letter-spacing: 6px !important;
        padding: 14px 20px !important;
      }

      .email-footer {
        font-size: 12px !important;
      }
    }

    @media (prefers-color-scheme: dark) {
      body,
      .email-body {
        background-color: #020617 !important;
      }

      .email-brand {
        color: #60a5fa !important;
      }

      .email-card {
        background-color: #0f172a !important;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.45) !important;
      }

      .email-header {
        background-color: #111827 !important;
      }

      .email-title {
        color: #f8fafc !important;
      }

      .email-message {
        color: #cbd5e1 !important;
      }

      .email-divider {
        border-top-color: #334155 !important;
      }

      .email-footer,
      .email-page-footer {
        color: #94a3b8 !important;
      }

      .otp-box {
        background-color: #172554 !important;
        border-color: #2563eb !important;
        color: #dbeafe !important;
      }

      .invite-button {
        background-color: #3b82f6 !important;
        color: #ffffff !important;
      }
    }
  </style>
</head>
<body class="email-body" style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <div class="email-shell" style="max-width: 520px; margin: 40px auto;">
    <div style="text-align: center; padding: 32px 0 24px;">
      <span class="email-brand" style="font-size: 24px; font-weight: 700; color: #2563eb;">CollabBoard</span>
    </div>

    <div class="email-card" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">
      <div class="email-header" style="background-color: #f1f5f9; padding: 32px 40px 24px; text-align: center;">
        <h1 class="email-title" style="color: #0f172a; font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">${title}</h1>
      </div>

      <div class="email-content" style="padding: 32px 40px;">
        <p class="email-message" style="color: #475569; font-size: 16px; margin: 0 0 28px 0; line-height: 1.6;">
          ${message}
        </p>

        ${contentHtml}

        <div class="email-divider" style="margin: 28px 0; border-top: 1px solid #e2e8f0;"></div>

        <p class="email-footer" style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.5;">
          ${footerHtml}
        </p>
      </div>
    </div>

    <div style="text-align: center; padding: 24px 0;">
      <p class="email-page-footer" style="color: #94a3b8; font-size: 12px; margin: 0;">
        &copy; 2026 CollabBoard. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;

export const createSignInOtpEmailHTML = (code: string) =>
  createEmailTemplate(
    "CollabBoard OTP: Your sign-in code",
    "Enter the one-time code below to securely sign in to CollabBoard.",
    `
      <div style="text-align: center; margin: 0 auto 8px;">
        <div class="otp-box" style="display: inline-block; padding: 16px 24px; border-radius: 12px; background-color: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; font-size: 30px; font-weight: 700; letter-spacing: 8px; line-height: 1.1; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
          ${code}
        </div>
      </div>
    `,
    "This code expires in 10 minutes.<br>If you didn't request this, you can safely ignore this email."
  );

export const createInvitationEmailHTML = (
  inviterName: string,
  organizationName: string,
  invitationUrl: string
) =>
  createEmailTemplate(
    `You're invited to ${organizationName}`,
    `${inviterName} has invited you to join their team on CollabBoard. Click the button below to accept the invitation.`,
    `
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <a class="invite-button" href="${invitationUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 500;">
              Accept Invitation
            </a>
          </td>
        </tr>
      </table>
    `,
    "If you weren't expecting this invitation, you can safely ignore this email."
  );
