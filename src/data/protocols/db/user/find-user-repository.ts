import { IUserModel } from '../../../usecases/signup/db-signup-protocols'

export interface ILoadUserByEmailOrIdRepository {
  loadUserByEmailOrId: (
    value: string
  ) => Promise<ILoadUserByEmailOrIdRepository.Result>
}

export namespace ILoadUserByEmailOrIdRepository {
  export type Result = IUserModel
}
