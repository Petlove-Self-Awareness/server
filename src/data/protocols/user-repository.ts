import { IUserDataProps } from '../../domain/models/user'
import { SignupData } from '../../domain/usecases/signup'

export interface IUserRepo {
  add: (userData: SignupData) => Promise<IUserDataProps>
}
