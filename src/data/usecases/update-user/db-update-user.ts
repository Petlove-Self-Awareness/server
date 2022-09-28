import {
  IUpdateUserUseCase,
  UpdateUserDto
} from '../../../domain/usecases/user/update-user'
import { UserEmail } from '../../../domain/value-objects/user-email'
import { UserName } from '../../../domain/value-objects/user-name'
import { UserPassword } from '../../../domain/value-objects/user-password'
import { Result } from '../load-user-by-token/db-load-user-by-token-protocols'
import { ILoadUserByEmailOrIdRepository, IUserModel } from '../signup/db-signup-protocols'

export class DbUpdateUser implements IUpdateUserUseCase {
  private changes: Result<any>[]

  constructor(
    private readonly loadUserByEmailOrIdRepository: ILoadUserByEmailOrIdRepository
  ) {
    this.changes = []
  }

  async update(updateUserDto: UpdateUserDto): Promise<Result<IUserModel>> {
    const { id, name, email, password } = updateUserDto
    const userExists = await this.loadUserByEmailOrIdRepository.loadUserByEmailOrId(id)

    return null
  }
}
