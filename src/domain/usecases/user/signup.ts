import { Result } from '../../logic/result'
import { IUserModel, UserRoles } from '../../models/user-model'

export interface SignupData {
  name: string
  email: string
  password: string
  role: UserRoles
}

export interface ISingupUseCase {
  signUp: (signupData: SignupData) => Promise<Result<IUserModel>>
}
