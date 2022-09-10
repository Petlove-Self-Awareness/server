import { PrismaClient } from '@prisma/client'
import { IUserRepo } from '../../../data/protocols/user-repository'
import { IUserDataProps } from '../../../domain/models/user'

export class UserPostgresRepository implements IUserRepo {
  private readonly prisma: PrismaClient
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient
  }

  async signUp(userData: IUserDataProps): Promise<void> {
    const { email, id, name, password } = userData
    await this.prisma.user.create({
      data: { id, email, name, password }
    })
  }
}
