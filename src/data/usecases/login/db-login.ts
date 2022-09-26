import {
  IEncrypter,
  IHashComparer,
  ILoadUserByEmailOrIdRepository,
  ILogin,
  AuthenticationModel,
  Result
} from './db-login-protocols'

export class DbAuthentication implements ILogin {
  constructor(
    private readonly loadUserByEmailOrIdRepository: ILoadUserByEmailOrIdRepository,
    private readonly hashComparer: IHashComparer,
    private readonly encrypter: IEncrypter
  ) {}

  async auth(authentication: AuthenticationModel): Promise<Result<string>> {
    const { email, password } = authentication
    const userOrNull =
      await this.loadUserByEmailOrIdRepository.loadUserByEmailOrId(email)
    if (!userOrNull) {
      return Result.fail('User email or password is/are incorrect')
    }
    const isCorrectPassword = await this.hashComparer.compare(
      password,
      userOrNull.password
    )
    if (!isCorrectPassword) {
      return Result.fail('User email or password is/are incorrect')
    }
    const token = this.encrypter.encrypt(userOrNull.id)
    return Result.ok(token)
  }
}
