import { IUserModel } from '../../../../domain/models/user'

export interface IDbSignup {
  signup: (data: IUserModel) => Promise<void>
}
