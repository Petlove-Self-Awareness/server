import { IUserDataProps } from '../../domain/models/user'
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

  async add(signupData: SignupData): Promise<IUserDataProps> {
    const { password } = signupData
    const id = this.idBuilder.createId()
    const hashedPassword = await this.encrypter.encrypt(password)
    const createdUser = await this.userRepository.add({
      ...signupData,
      password: hashedPassword,
      id
    })
    return createdUser
  }
}
