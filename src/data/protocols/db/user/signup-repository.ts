import { IUserModel } from '../../../usecases/signup/db-signup-protocols'

export interface ISignupRepository {
  signup: (data: IUserModel) => Promise<void>
}
