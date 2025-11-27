/**
 * Contact Form API Route
 * Handles contact form submissions, stores leads in D1, and sends email notifications
 */

import { NextResponse, type NextRequest } from 'next/server';

import { LeadRepository, type CreateLeadData } from '@/repositories';
import { z } from 'zod';

import { withMiddleware } from '@/lib/api/middleware';
import {
  createdResponse,
  errorResponse,
  validationErrorResponse,
  type ApiResponse,
} from '@/lib/api/response';
import { createPrismaClient } from '@/lib/db/client';
import { AppError, ErrorType } from '@/lib/errors';
import { logger } from '@/lib/logger';

export const runtime = 'edge';

const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 5000;

/**
 * Contact form validation schema
 */
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(30).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  subject: z.string().max(200).optional().nullable(),
  message: z
    .string()
    .min(MESSAGE_MIN_LENGTH, 'Message must be at least 10 characters')
    .max(MESSAGE_MAX_LENGTH),
  locale: z.enum(['en', 'zh']).optional().nullable(),
});

type ContactFormInput = z.infer<typeof contactFormSchema>;

/**
 * POST /api/contact
 * Submit a contact form
 */
export function POST(request: NextRequest) {
  return withMiddleware<ApiResponse>(request, async (): Promise<NextResponse<ApiResponse>> => {
    try {
      // Parse request body
      const body = (await request.json()) as ContactFormInput;

      // Validate input
      const result = contactFormSchema.safeParse(body);
      if (!result.success) {
        return validationErrorResponse('Validation failed', result.error.flatten().fieldErrors);
      }

      const data = result.data;

      // Get client information
      const ipAddress =
        request.headers.get('cf-connecting-ip') ||
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        null;
      const userAgent = request.headers.get('user-agent') || null;

      // Prepare lead data
      const leadData: CreateLeadData = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        subject: data.subject || null,
        message: data.message,
        source: 'contact_form',
        locale: data.locale || 'en',
        ipAddress,
        userAgent,
      };

      // Get database client
      const prisma = createPrismaClient();
      if (!prisma) {
        throw new AppError('Database not available', ErrorType.DATABASE_ERROR, 503);
      }

      // Store in database
      const leadRepository = new LeadRepository(prisma);
      const lead = await leadRepository.create(leadData);

      logger.info('Contact form submission stored', {
        leadId: lead.id,
        email: lead.email,
      });

      // Send email notification (async, don't block response)
      // TEMPORARILY DISABLED: Email functionality disabled to resolve build issues
      // TODO: Re-enable email functionality after @react-email/render issue is resolved
      /*
      try {
        const { getEmailService } = await import('@/lib/email/resend');
        const emailService = getEmailService();
        if (emailService.isConfigured()) {
          emailService
            .sendContactNotification({
              name: data.name,
              email: data.email,
              phone: data.phone,
              company: data.company,
              subject: data.subject,
              message: data.message,
              locale: data.locale,
              submittedAt: new Date(),
            })
            .catch((err: unknown) => {
              const error = err instanceof Error ? err : new Error(String(err));
              logger.error('Failed to send email notification', error);
            });
        }
      } catch (err: unknown) {
        // Log but don't fail the request
        logger.warn('Email service not available', err instanceof Error ? err.message : String(err));
      }
      */

      return createdResponse(
        {
          id: lead.id,
          message: 'Contact form submitted successfully',
        },
        'Contact form submitted successfully'
      );
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Contact form submission failed', error);
      return errorResponse(err);
    }
  });
}
