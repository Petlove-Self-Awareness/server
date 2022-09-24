import { Result } from '../../../../domain/logic/result'
import { IUserModel } from '../../../usecases/signup/db-signup-protocols'

export interface ILoadUserByEmailOrIdRepository {
  loadUserByEmailOrId: (value: string) => Promise<IUserModel>
}
