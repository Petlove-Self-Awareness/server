import { PrismaClient } from '@prisma/client'
import { ILogErrorRepository } from '../../../../data/protocols/db/log/log-error-repository'

export class LogPostgresRepository implements ILogErrorRepository {
  private readonly prisma: PrismaClient
  async logError(stack: string): Promise<void> {
    await this.prisma.error.create({ data: { stack } })
  }
}
