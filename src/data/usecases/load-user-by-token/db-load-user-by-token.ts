import {
  IUserModel,
  Result,
  ILoadUserByToken,
  IDecrypter,
  ILoadUserByEmailOrIdRepository
} from './db-load-user-by-token-protocols'

export class DbLoadAccountByToken implements ILoadUserByToken {
  constructor(
    private readonly decrypter: IDecrypter,
    private readonly loadUserByIdRepository: ILoadUserByEmailOrIdRepository
  ) {}

  async load(token: string): Promise<Result<IUserModel>> {
    const userId = this.decrypter.decrypt(token)
    if (userId) {
      const user = await this.loadUserByIdRepository.loadUserByEmailOrId(userId)
      if (user.isFailure) {
        return Result.fail(user.error)
      }
      return Result.ok(user.getValue())
    }
    return Result.fail('User was not found')
  }
}
