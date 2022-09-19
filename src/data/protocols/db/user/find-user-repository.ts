import { Result } from '../../../../domain/logic/result'
import { User } from '../../../../domain/models/user'
import { IUserModel } from '../../../usecases/signup/db-signup-protocols'

export interface ILoadUserByEmailOrIdRepository {
  loadUserByEmailOrId: (value: string) => Promise<Result<IUserModel>>
}
