import { Prisma, PrismaClient, user } from '@prisma/client'
import { IUUIDValidator } from '../../../data/protocols/criptography/id-validator'
import { IDbFindUser } from '../../../data/protocols/db/user/find-user-repository'
import { IDbSignup } from '../../../data/protocols/db/user/signup-repository'
import { Result } from '../../../domain/logic/result'
import { IUserModel, User } from '../../../domain/models/user'
import { SignupData } from '../../../domain/usecases/signup'

export class UserPostgresRepository implements IDbSignup, IDbFindUser {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly idAdapter: IUUIDValidator
  ) {}
  async findUserByEmailOrId(value: string): Promise<Result<User>> {
    let register: user
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
      return Result.fail('User was not found')
    }
    const userOrError = User.create(
      {
        email: register.email,
        name: register.name,
        password: register.password
      },
      register.id
    )

    if (userOrError.isFailure) {
    }
  }

  async signup(userData: IUserModel): Promise<void> {
    await this.prisma.user.create({
      data: { ...userData, name: userData.name.value }
    })
  }
}
