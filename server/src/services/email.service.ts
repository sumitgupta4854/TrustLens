import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const emailService = {
  async sendEmail(options: EmailOptions): Promise<boolean> {
    const { to, subject, text, html } = options;

    // In development or when email provider is set to console / missing key:
    if (env.EMAIL_PROVIDER === 'console' || !env.EMAIL_PROVIDER_API_KEY) {
      logger.info(`[EMAIL SERVICE DEV SIMULATION]`);
      logger.info(`To: ${to}`);
      logger.info(`Subject: ${subject}`);
      logger.info(`Body:\n${text}`);
      if (html) {
        logger.debug(`HTML Body available: ${html.substring(0, 100)}...`);
      }
      return true;
    }

    // If an external provider is configured (e.g., Resend)
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.EMAIL_PROVIDER_API_KEY}`,
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM,
          to: [to],
          subject,
          text,
          html: html || text,
        }),
      });

      if (!response.ok) {
        const errData = await response.text();
        logger.error(`Email delivery provider error: ${response.status}`, errData);
        return false;
      }

      logger.info(`Email successfully dispatched via provider to: ${to}`);
      return true;
    } catch (error) {
      logger.error('Failed to send email via external provider:', error);
      return false;
    }
  },

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const verificationUrl = `${env.APP_BASE_URL}/verify-email?token=${encodeURIComponent(token)}`;
    const subject = 'Verify your email — TrustLens';
    const text = `Welcome to TrustLens!\n\nPlease verify your email address to secure your account by clicking the link below:\n${verificationUrl}\n\nThis verification link expires in 24 hours.\n\nIf you did not create a TrustLens account, you can safely disregard this email.`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #20243A; background: #F8F8FC; border-radius: 12px;">
        <h2 style="color: #7868F6; margin-bottom: 12px;">TrustLens Email Verification</h2>
        <p style="font-size: 15px; line-height: 1.5;">Welcome to TrustLens. Please confirm your email to activate your account and start setting your personal boundaries.</p>
        <p style="margin: 24px 0;">
          <a href="${verificationUrl}" style="background-color: #7868F6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Verify Email Address</a>
        </p>
        <p style="font-size: 13px; color: #687087;">Or copy and paste this link into your browser:<br/><a href="${verificationUrl}" style="color: #7868F6;">${verificationUrl}</a></p>
        <hr style="border: none; border-top: 1px solid #E7E9F2; margin: 24px 0;" />
        <p style="font-size: 12px; color: #687087;">This link expires in 24 hours. If you did not create this account, no action is required.</p>
      </div>
    `;

    return this.sendEmail({ to: email, subject, text, html });
  },

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetUrl = `${env.APP_BASE_URL}/reset-password?token=${encodeURIComponent(token)}`;
    const subject = 'Password Reset Request — TrustLens';
    const text = `You requested a password reset for your TrustLens account.\n\nPlease visit the following link to set a new password:\n${resetUrl}\n\nThis link is single-use and will expire in 1 hour.\n\nIf you did not request this reset, your account is still secure and you can ignore this email.`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #20243A; background: #F8F8FC; border-radius: 12px;">
        <h2 style="color: #7868F6; margin-bottom: 12px;">Reset Your TrustLens Password</h2>
        <p style="font-size: 15px; line-height: 1.5;">We received a request to reset your password. Click the button below to choose a new password.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background-color: #7868F6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Reset Password</a>
        </p>
        <p style="font-size: 13px; color: #687087;">Or copy and paste this link:<br/><a href="${resetUrl}" style="color: #7868F6;">${resetUrl}</a></p>
        <hr style="border: none; border-top: 1px solid #E7E9F2; margin: 24px 0;" />
        <p style="font-size: 12px; color: #687087;">This single-use link expires in 60 minutes. If you did not request this, please ensure your account credentials remain safe.</p>
      </div>
    `;

    return this.sendEmail({ to: email, subject, text, html });
  },
};
