import { Result } from '../logic/result'
import { IUserModel } from '../models/user-model'

export interface SignupData {
  name: string
  email: string
  password: string
}

export interface ISingupUseCase {
  signUp: (signupData: SignupData) => Promise<Result<IUserModel>>
}
