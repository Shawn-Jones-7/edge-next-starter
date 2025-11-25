import { PrismaClient } from '@prisma/client';

import { LeadRepository } from './lead.repository';

/**
 * Repository Factory
 * Create and manage all repository instances
 */
export class RepositoryFactory {
  private leadRepo?: LeadRepository;

  constructor(private prisma: PrismaClient) {}

  /**
   * Get Lead Repository
   */
  get leads(): LeadRepository {
    if (!this.leadRepo) {
      this.leadRepo = new LeadRepository(this.prisma);
    }
    return this.leadRepo;
  }
}

/**
 * Create Repository Factory instance
 */
export function createRepositories(prisma: PrismaClient): RepositoryFactory {
  return new RepositoryFactory(prisma);
}

// Export all repositories
export { LeadRepository, type CreateLeadData, type UpdateLeadData } from './lead.repository';
