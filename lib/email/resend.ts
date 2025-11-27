/**
 * Resend Email Service
 * Handles email notifications for contact form submissions
 * TEMPORARILY DISABLED: To resolve build issues with @react-email/render
 */

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
 * Resend Email Service class (stubbed)
 */
export class ResendEmailService {
  constructor() {
    // No-op: Resend initialization is disabled
    logger.warn('Resend email service is disabled due to @react-email/render build issues');
  }

  /**
   * Check if the email service is configured
   */
  isConfigured(): boolean {
    // Always return false to disable email functionality
    return false;
  }

  /**
   * Send contact form notification email (stubbed)
   */
  sendContactNotification(data: ContactEmailData): EmailResult {
    logger.info('Email service disabled - contact notification not sent', {
      name: data.name,
      email: data.email,
    });

    return {
      success: false,
      error: 'Email service disabled',
    };
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
