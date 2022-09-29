import { PrismaClient, user } from '@prisma/client'
import { IUUIDValidator } from '../../../data/protocols/criptography/id-validator'
import { ILoadUserByEmailOrIdRepository } from '../../../data/protocols/db/user/find-user-repository'
import { ISignupRepository } from '../../../data/protocols/db/user/signup-repository'
import { IUpdateUserRepository } from '../../../data/protocols/db/user/update-user-repository'
import { Result } from '../../../domain/logic/result'
import { IUserModel, UserRoles } from '../../../domain/models/user-model'
import { UpdateUserData } from '../../../domain/usecases/user/update-user'

export class UserPostgresRepository
  implements ISignupRepository, ILoadUserByEmailOrIdRepository, IUpdateUserRepository
{
  constructor(
    private readonly idAdapter: IUUIDValidator,
    private readonly prisma: PrismaClient
  ) {}

  async signup(data: IUserModel): Promise<void> {
    await this.prisma.user.create({
      data
    })
  }

  async loadUserByEmailOrId(value: string): Promise<IUserModel> {
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
      return null
    }
    const role = register.role as UserRoles
    return { ...register, role }
  }

  async update(data: UpdateUserData): Promise<void> {
    const dataToUpdate = Object.assign({}, data)
    delete dataToUpdate.id
    await this.prisma.user.update({ where: { id: data.id }, data: dataToUpdate })
  }
}
