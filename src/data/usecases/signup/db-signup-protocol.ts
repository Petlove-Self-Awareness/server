import { Result } from '../../../domain/logic/result'
import { User } from '../../../domain/models/user'
import { ISingupUseCase, SignupData } from '../../../domain/usecases/signup'
import { IHasher } from '../../protocols/criptography/hasher'
import { IDBuilder } from '../../protocols/criptography/id-builder'
import { IDbSignup } from '../../protocols/db/user/signup-repository'

export class DbSingup implements ISingupUseCase {
  constructor(
    private readonly hasher: IHasher,
    private readonly idBuilder: IDBuilder,
    private readonly dbSignup: IDbSignup
  ) {}

  async signUp(signupData: SignupData): Promise<Result<User>> {
    const { password, email, name } = signupData
    const id = this.idBuilder.createId()
    const userOrError = User.create({ email, name, password }, id)
    const hashedPassword = await this.hasher.hash(password)
    await this.dbSignup.signup({
      id,
      email,
      name: userOrError.getValue().userName,
      password: hashedPassword
    })
    return Result.ok<User>(userOrError.getValue())
  }
}
