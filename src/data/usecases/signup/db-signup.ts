import { Result } from '../../../domain/logic/result'
import { User } from '../../../domain/models/user'
import {
  IDBuilder,
  IHasher,
  ILoadUserByEmailOrIdRepository,
  ISignupRepository,
  ISingupUseCase,
  IUserModel,
  SignupData
} from './db-signup-protocols'

export class DbSignUp implements ISingupUseCase {
  constructor(
    private readonly hasher: IHasher,
    private readonly idBuilder: IDBuilder,
    private readonly loadUserByEmailOrIdRepository: ILoadUserByEmailOrIdRepository,
    private readonly signupRepository: ISignupRepository
  ) {}

  async signUp(signupData: SignupData): Promise<Result<IUserModel>> {
    const { password, email, name, role } = signupData
    const userExists =
      await this.loadUserByEmailOrIdRepository.loadUserByEmailOrId(email)
    if (userExists.isSuccess) {
      return Result.fail<IUserModel>('User email is already being used')
    }
    const hashedPassword = await this.hasher.hash(password)
    const id = this.idBuilder.createId()
    const validUser = User.create({ name, email, password, role }, id)
    if (validUser.isFailure) {
      return Result.fail<IUserModel>(validUser.error)
    }
    await this.signupRepository.signup({
      email,
      name,
      role,
      password: hashedPassword,
      id
    })
    return Result.ok<IUserModel>({ name, email, password: hashedPassword, id, role })
  }
}
