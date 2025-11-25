import { PrismaClient } from '@prisma/client';

import { analytics } from '@/lib/analytics';
import { DatabaseError, DatabaseQueryError } from '@/lib/errors';

/**
 * Lead data for creation
 */
export interface CreateLeadData {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  subject?: string | null;
  message: string;
  source?: string | null;
  locale?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Lead data for update
 */
export interface UpdateLeadData {
  status?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  company?: string | null;
  subject?: string | null;
  message?: string;
}

/**
 * Lead Repository
 * Responsible for contact form submissions / inquiries database operations
 */
export class LeadRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Query all leads
   */
  async findAll(options?: { status?: string; orderBy?: 'asc' | 'desc'; limit?: number }) {
    const { status, orderBy = 'desc', limit } = options || {};
    try {
      const start = Date.now();
      const leads = await this.prisma.lead.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: orderBy },
        take: limit,
      });
      await analytics.trackDatabaseQuery({
        operation: 'lead.findAll',
        table: 'leads',
        duration: Date.now() - start,
        metadata: { status, orderBy, limit },
      });
      return leads;
    } catch (error) {
      throw new DatabaseQueryError('Failed to fetch leads', error);
    }
  }

  /**
   * Find lead by ID
   */
  async findById(id: number) {
    try {
      const start = Date.now();
      const lead = await this.prisma.lead.findUnique({
        where: { id },
      });
      await analytics.trackDatabaseQuery({
        operation: 'lead.findById',
        table: 'leads',
        duration: Date.now() - start,
        metadata: { id },
      });
      return lead;
    } catch (error) {
      throw new DatabaseQueryError(`Failed to fetch lead with id ${id}`, error);
    }
  }

  /**
   * Find leads by email
   */
  async findByEmail(email: string) {
    try {
      const start = Date.now();
      const leads = await this.prisma.lead.findMany({
        where: { email },
        orderBy: { createdAt: 'desc' },
      });
      await analytics.trackDatabaseQuery({
        operation: 'lead.findByEmail',
        table: 'leads',
        duration: Date.now() - start,
        metadata: { email },
      });
      return leads;
    } catch (error) {
      throw new DatabaseQueryError(`Failed to fetch leads with email ${email}`, error);
    }
  }

  /**
   * Create lead (contact form submission)
   */
  async create(data: CreateLeadData) {
    try {
      const start = Date.now();
      const lead = await this.prisma.lead.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone ?? null,
          company: data.company ?? null,
          subject: data.subject ?? null,
          message: data.message,
          source: data.source ?? null,
          locale: data.locale ?? null,
          ipAddress: data.ipAddress ?? null,
          userAgent: data.userAgent ?? null,
        },
      });
      await analytics.trackDatabaseQuery({
        operation: 'lead.create',
        table: 'leads',
        duration: Date.now() - start,
      });
      return lead;
    } catch (error) {
      throw new DatabaseError('Failed to create lead', error);
    }
  }

  /**
   * Update lead (e.g., change status)
   */
  async update(id: number, data: UpdateLeadData) {
    try {
      const start = Date.now();
      const lead = await this.prisma.lead.update({
        where: { id },
        data,
      });
      await analytics.trackDatabaseQuery({
        operation: 'lead.update',
        table: 'leads',
        duration: Date.now() - start,
        metadata: { id },
      });
      return lead;
    } catch (error) {
      throw new DatabaseError(`Failed to update lead with id ${id}`, error);
    }
  }

  /**
   * Update lead status
   */
  updateStatus(id: number, status: string) {
    return this.update(id, { status });
  }

  /**
   * Delete lead
   */
  async delete(id: number) {
    try {
      const start = Date.now();
      const deleted = await this.prisma.lead.delete({
        where: { id },
      });
      await analytics.trackDatabaseQuery({
        operation: 'lead.delete',
        table: 'leads',
        duration: Date.now() - start,
        metadata: { id },
      });
      return deleted;
    } catch (error) {
      throw new DatabaseError(`Failed to delete lead with id ${id}`, error);
    }
  }

  /**
   * Count leads by status
   */
  async countByStatus(status?: string) {
    try {
      const start = Date.now();
      const count = await this.prisma.lead.count({
        where: status ? { status } : undefined,
      });
      await analytics.trackDatabaseQuery({
        operation: 'lead.countByStatus',
        table: 'leads',
        duration: Date.now() - start,
        metadata: { status },
      });
      return count;
    } catch (error) {
      throw new DatabaseQueryError('Failed to count leads', error);
    }
  }
}
