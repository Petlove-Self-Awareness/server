import { IUserModel } from '../../../../domain/models/user-model'

export interface ISignupRepository {
  signup: (data: IUserModel) => Promise<void>
}
