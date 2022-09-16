import { Result } from '../logic/result'
import { User } from '../models/user'

export interface SignupData {
  name: string
  email: string
  password: string
}

export interface ISingupUseCase {
  signUp: (signupData: SignupData) => Promise<Result<User>>
}
