import type { EmailConfig } from './types';

/**
 * Get email configuration from environment variables
 */
export function getEmailConfig(): EmailConfig {
  return {
    contactEmail: process.env.CONTACT_EMAIL || 'contact@example.com',
    fromEmail: process.env.FROM_EMAIL || 'noreply@example.com',
    fromEmailAutoReply: process.env.FROM_EMAIL_AUTO_REPLY,
  };
}

/**
 * Create email configuration
 */
export function createEmailConfig(config: Partial<EmailConfig>): EmailConfig {
  const defaults = getEmailConfig();
  return {
    ...defaults,
    ...config,
  };
}

/**
 * Send contact email using Resend (server-side only)
 * @param resend - Resend client instance
 * @param config - Email configuration
 * @param data - Contact form data
 */
export async function sendContactEmail(
  resend: any,
  config: EmailConfig,
  data: { email: string; message: string }
) {
  return resend.emails.send({
    from: config.fromEmail,
    to: [config.contactEmail],
    subject: `New Contact Form Submission from ${data.email}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b;">New Contact Form Submission</h2>

        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${data.email}</p>
          <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #1e293b; margin-top: 0;">Message:</h3>
          <p style="color: #475569; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
        </div>

        <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">
          This email was sent from your contact form.
        </p>
      </div>
    `,
    text: `New Contact Form Submission\n\nFrom: ${data.email}\nDate: ${new Date().toLocaleString()}\n\nMessage:\n${data.message}`,
  });
}
