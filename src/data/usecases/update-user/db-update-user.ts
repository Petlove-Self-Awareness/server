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
    if (!userExists) {
      return Result.fail<IUserModel>('Invalid user id')
    }

    if (name) {
      const nameOrError: Result<UserName> = UserName.create(name)
      if (nameOrError.isSuccess) {
        this.addChange(nameOrError)
      }
    }

    if (email) {
      const emailOrError = UserEmail.create(email)
      if (emailOrError.isSuccess) {
        this.addChange(emailOrError)
      }
    }

    if (password) {
      const passwordOrError = UserPassword.create(password)
      if (passwordOrError.isSuccess) {
        this.addChange(passwordOrError)
      }
    }
  }

  public addChange(result: Result<any>): void {
    this.changes.push(result)
  }

  public getCombinedChangesResult(): Result<any> {
    return Result.combine(this.changes)
  }
}
