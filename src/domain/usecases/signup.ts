import { IUserDataProps } from '../models/user'

export interface SignupData {
  name: string
  email: string
  password: string
}

export interface ISingupUseCase {
  add: (signupData: SignupData) => Promise<IUserDataProps>
}
