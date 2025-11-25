/**
 * Resend Email Service
 * Handles email notifications for contact form submissions
 */

import { Resend } from 'resend';

import { logger } from '@/lib/logger';

/**
 * Contact form data for email notification
 */
export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  subject?: string | null;
  message: string;
  locale?: string | null;
  submittedAt: Date;
}

/**
 * Email send result
 */
export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Resend Email Service class
 */
export class ResendEmailService {
  private resend: Resend | null = null;
  private fromEmail: string;
  private toEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    this.toEmail = process.env.RESEND_TO_EMAIL || '';

    if (apiKey) {
      this.resend = new Resend(apiKey);
    }
  }

  /**
   * Check if the email service is configured
   */
  isConfigured(): boolean {
    return this.resend !== null && this.toEmail !== '';
  }

  /**
   * Send contact form notification email
   */
  async sendContactNotification(data: ContactEmailData): Promise<EmailResult> {
    if (!this.isConfigured()) {
      logger.warn('Resend email service is not configured, skipping email notification');
      return {
        success: false,
        error: 'Email service not configured',
      };
    }

    const subject = data.subject
      ? `[Website Inquiry] ${data.subject}`
      : `[Website Inquiry] New contact from ${data.name}`;

    const htmlContent = this.generateHtmlEmail(data);
    const textContent = this.generateTextEmail(data);

    try {
      const result = await this.resend!.emails.send({
        from: this.fromEmail,
        to: this.toEmail,
        replyTo: data.email,
        subject,
        html: htmlContent,
        text: textContent,
      });

      if (result.error) {
        logger.error('Failed to send email', new Error(result.error.message), {
          errorName: result.error.name,
        });
        return {
          success: false,
          error: result.error.message,
        };
      }

      logger.info('Contact notification email sent', { emailId: result.data?.id });
      return {
        success: true,
        id: result.data?.id,
      };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to send email', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate HTML email content
   */
  private generateHtmlEmail(data: ContactEmailData): string {
    const formattedDate = data.submittedAt.toLocaleString(
      data.locale === 'zh' ? 'zh-CN' : 'en-US',
      {
        dateStyle: 'full',
        timeStyle: 'short',
      }
    );

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f8f9fa; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #fff; padding: 20px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 16px; }
    .label { font-weight: 600; color: #495057; margin-bottom: 4px; }
    .value { color: #212529; }
    .message-box { background: #f8f9fa; padding: 16px; border-radius: 4px; white-space: pre-wrap; }
    .footer { margin-top: 20px; padding-top: 16px; border-top: 1px solid #e9ecef; font-size: 12px; color: #6c757d; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0; color: #212529;">New Contact Form Submission</h2>
      <p style="margin: 8px 0 0; color: #6c757d;">${formattedDate}</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name</div>
        <div class="value">${this.escapeHtml(data.name)}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${this.escapeHtml(data.email)}">${this.escapeHtml(data.email)}</a></div>
      </div>
      ${
        data.phone
          ? `
      <div class="field">
        <div class="label">Phone</div>
        <div class="value">${this.escapeHtml(data.phone)}</div>
      </div>
      `
          : ''
      }
      ${
        data.company
          ? `
      <div class="field">
        <div class="label">Company</div>
        <div class="value">${this.escapeHtml(data.company)}</div>
      </div>
      `
          : ''
      }
      ${
        data.subject
          ? `
      <div class="field">
        <div class="label">Subject</div>
        <div class="value">${this.escapeHtml(data.subject)}</div>
      </div>
      `
          : ''
      }
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">${this.escapeHtml(data.message)}</div>
      </div>
      <div class="footer">
        <p>This email was sent from your website contact form.</p>
        <p>Locale: ${data.locale || 'en'}</p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate plain text email content
   */
  private generateTextEmail(data: ContactEmailData): string {
    const formattedDate = data.submittedAt.toLocaleString(
      data.locale === 'zh' ? 'zh-CN' : 'en-US',
      {
        dateStyle: 'full',
        timeStyle: 'short',
      }
    );

    let text = `
New Contact Form Submission
============================
Submitted: ${formattedDate}

Name: ${data.name}
Email: ${data.email}
`;

    if (data.phone) {
      text += `Phone: ${data.phone}\n`;
    }
    if (data.company) {
      text += `Company: ${data.company}\n`;
    }
    if (data.subject) {
      text += `Subject: ${data.subject}\n`;
    }

    text += `
Message:
--------
${data.message}

---
This email was sent from your website contact form.
Locale: ${data.locale || 'en'}
    `.trim();

    return text;
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
  }
}

// Singleton instance
let emailServiceInstance: ResendEmailService | null = null;

/**
 * Get the email service instance
 */
export function getEmailService(): ResendEmailService {
  if (!emailServiceInstance) {
    emailServiceInstance = new ResendEmailService();
  }
  return emailServiceInstance;
}
