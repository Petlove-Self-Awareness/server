import { User } from '../../domain/models/user'
import { ISingupUseCase, SignupData } from '../../domain/usecases/signup'
import { IEncrypter } from '../protocols/encrypter'
import { IDBuilder } from '../protocols/id-builder'
import { IUserRepo } from '../protocols/user-repository'

export class DbSingup implements ISingupUseCase {
  private readonly encrypter: IEncrypter
  private readonly idBuilder: IDBuilder
  private readonly userRepository: IUserRepo

  constructor(
    encrypter: IEncrypter,
    idBuilder: IDBuilder,
    userRepository: IUserRepo
  ) {
    this.encrypter = encrypter
    this.idBuilder = idBuilder
    this.userRepository = userRepository
  }

  async add(signupData: SignupData): Promise<void> {
    const { password, email, name } = signupData
    const id = this.idBuilder.createId()
    User.create({ id, email, name, password })
    const hashedPassword = await this.encrypter.encrypt(password)
    return this.userRepository.signUp({
      ...signupData,
      password: hashedPassword,
      id
    })
  }
}
