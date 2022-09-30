import { IUserModel } from '../../../../domain/models/user-model'

export interface ILoadUserByEmailOrIdRepository {
  loadUserByEmailOrId: (
    value: string
  ) => Promise<ILoadUserByEmailOrIdRepository.Result>
}

export namespace ILoadUserByEmailOrIdRepository {
  export type Result = IUserModel
}
