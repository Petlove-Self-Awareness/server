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
      const userOrNull = await this.loadUserByIdRepository.loadUserByEmailOrId(
        userId
      )
      if (!userOrNull) {
        return Result.fail('User was not found')
      }
      return Result.ok(userOrNull)
    }
    return Result.fail('User was not found')
  }
}
