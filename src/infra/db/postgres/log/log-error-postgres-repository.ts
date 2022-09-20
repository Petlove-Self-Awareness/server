import { PrismaClient, history } from '@prisma/client'
import { ILogErrorRepository } from '../../../../data/protocols/db/log/log-error-repository'

export class LogPostgresRepository implements ILogErrorRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async logError(stack: string): Promise<void> {
    let register: history
    register = await this.prisma.history.create({ data: { stack } })
  }
}
