import { PrismaClient } from '@prisma/client'
import { IDBuilder } from '../../../data/protocols/id-builder'
import { IUserRepo } from '../../../data/protocols/user-repository'
import { IUserDataProps, User } from '../../../domain/models/user'

export class UserPostgresRepository implements IUserRepo {
  private readonly prisma: PrismaClient
  private readonly idAdapter: IDBuilder
  constructor(prismaClient: PrismaClient, idAdapter: IDBuilder) {
    this.prisma = prismaClient
    this.idAdapter = idAdapter
  }

  async findUserByEmailOrId(value: string): Promise<User> {
    let register
    const isUUID = this.idAdapter.isUUID(value)
    if (isUUID) {
      register = await this.prisma.user.findUnique({
        where: { id: value }
      })
    } else {
      register = await this.prisma.user.findUnique({
        where: { email: value }
      })
    }
    if (!register) {
      throw new Error('User does not exist')
    }
    return User.create(
      {
        email: register.email,
        name: register.name,
        password: register.password
      },
      register.id
    )
  }

  async signUp(userData: IUserDataProps): Promise<void> {
    const { email, id, name, password } = userData
    await this.findUserByEmailOrId(email)
    await this.prisma.user.create({
      data: { id, email, name, password }
    })
  }
}
