import { IUserDataProps } from '../../domain/models/user'
import { ISingupUseCase, SignupData } from '../../domain/usecases/signup'
import { IEncrypter } from '../protocols/encrypter'
import { IUserRepo } from '../protocols/user-repository'

export class DbSingup implements ISingupUseCase {
  private readonly encrypter: IEncrypter
  private readonly userRepository: IUserRepo

  constructor(encrypter: IEncrypter, userRepository: IUserRepo) {
    this.encrypter = encrypter
    this.userRepository = userRepository
  }

  async add(signupData: SignupData): Promise<IUserDataProps> {
    const { password } = signupData
    const hashedPassword = await this.encrypter.encrypt(password)
    const createdUser = await this.userRepository.add({
      ...signupData,
      password: hashedPassword
    })
    return createdUser
  }
}
