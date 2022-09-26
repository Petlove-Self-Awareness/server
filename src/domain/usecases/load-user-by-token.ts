import { Result } from '../logic/result'
import { IUserModel } from '../models/user-model'

export interface ILoadUserByToken {
  load: (token: string) => Promise<Result<IUserModel>>
}
