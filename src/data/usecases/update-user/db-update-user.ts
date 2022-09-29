import { User } from '../../../domain/models/user'
import {
  IUpdateUserUseCase,
  UpdateUserDto
} from '../../../domain/usecases/user/update-user'
import { UserEmail } from '../../../domain/value-objects/user-email'
import { UserName } from '../../../domain/value-objects/user-name'
import { UserPassword } from '../../../domain/value-objects/user-password'
import { IUpdateUserRepository } from '../../protocols/db/user/update-user-repository'
import { Result } from '../load-user-by-token/db-load-user-by-token-protocols'
import { ILoadUserByEmailOrIdRepository, IUserModel } from '../signup/db-signup-protocols'

export class DbUpdateUser implements IUpdateUserUseCase {
  constructor(
    private readonly loadUserByEmailOrIdRepository: ILoadUserByEmailOrIdRepository,
    private readonly updateUserRepository: IUpdateUserRepository
  ) {}

  async update(updateUserDto: UpdateUserDto): Promise<Result<IUserModel>> {
    const { id, name, email, password } = updateUserDto
    const userExists = await this.loadUserByEmailOrIdRepository.loadUserByEmailOrId(id)
    if (!userExists) {
      return Result.fail<IUserModel>('Invalid user id')
    }
    const userResult: Result<User> = User.create(
      {
        name: userExists.name,
        email: userExists.email,
        password: userExists.password,
        role: userExists.role
      },
      userExists.id
    )
    if (userResult.isFailure) {
      throw new Error('Error when retrieving from database')
    }

    let userInstance: User = userResult.getValue()

    let user: UpdateUserDto = {
      id: updateUserDto.id
    }

    if (name) {
      const nameOrError: Result<UserName> = UserName.create(name)
      if (nameOrError.isSuccess) {
        userInstance.updateName = nameOrError.getValue()
      } else {
        return Result.fail(nameOrError.error)
      }
    }

    if (email) {
      const emailOrError = UserEmail.create(email)
      if (emailOrError.isSuccess) {
        userInstance.updateEmail = emailOrError.getValue()
      } else {
        return Result.fail(emailOrError.error)
      }
    }

    if (password) {
      const passwordOrError = UserPassword.create(password)
      if (passwordOrError.isSuccess) {
        userInstance.updatePassword = passwordOrError.getValue()
      } else {
        return Result.fail(passwordOrError.error)
      }
    }

    await this.updateUserRepository.update(userInstance.convertToModel())
  }
}
