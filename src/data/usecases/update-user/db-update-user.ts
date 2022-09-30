import {
  IUpdateUserUseCase,
  UpdateUserData
} from '../../../domain/usecases/user/update-user'
import { UserEmail } from '../../../domain/value-objects/user-email'
import { UserName } from '../../../domain/value-objects/user-name'
import { UserPassword } from '../../../domain/value-objects/user-password'
import { IUpdateUserRepository } from '../../protocols/db/user/update-user-repository'
import { Result } from '../load-user-by-token/db-load-user-by-token-protocols'
import {
  IHasher,
  ILoadUserByEmailOrIdRepository,
  IUserModel
} from '../signup/db-signup-protocols'

export class DbUpdateUser implements IUpdateUserUseCase {
  constructor(
    private readonly loadUserByEmailOrIdRepository: ILoadUserByEmailOrIdRepository,
    private readonly hasher: IHasher,
    private readonly updateUserRepository: IUpdateUserRepository
  ) {}

  async update(updateUserData: UpdateUserData): Promise<Result<any>> {
    const { id, name, email, password } = updateUserData
    const userExists = await this.loadUserByEmailOrIdRepository.loadUserByEmailOrId(id)
    if (!userExists) {
      return Result.fail<IUserModel>('Invalid user id')
    }

    let user: UpdateUserData = {
      id: userExists.id
    }

    if (name) {
      const nameOrError: Result<UserName> = UserName.create(name)
      if (nameOrError.isSuccess) {
        user.name = name
      } else {
        return Result.fail(nameOrError.error)
      }
    }

    if (email) {
      const emailOrError = UserEmail.create(email)
      if (emailOrError.isSuccess) {
        user.email = email
      } else {
        return Result.fail(emailOrError.error)
      }
    }

    if (password) {
      const passwordOrError = UserPassword.create(password)
      if (passwordOrError.isSuccess) {
        const hashedPassword = await this.hasher.hash(password)
        user.password = hashedPassword
      } else {
        return Result.fail(passwordOrError.error)
      }
    }

    await this.updateUserRepository.update(user)
    return Result.ok('updated')
  }
}
