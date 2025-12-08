import { EmailConfig } from './types';

/**
 * Get email configuration from environment variables
 */
declare function getEmailConfig(): EmailConfig;
/**
 * Create email configuration
 */
declare function createEmailConfig(config: Partial<EmailConfig>): EmailConfig;
/**
 * Send contact email using Resend (server-side only)
 * @param resend - Resend client instance
 * @param config - Email configuration
 * @param data - Contact form data
 */
declare function sendContactEmail(resend: any, config: EmailConfig, data: {
    email: string;
    message: string;
}): Promise<any>;

export { createEmailConfig, getEmailConfig, sendContactEmail };
