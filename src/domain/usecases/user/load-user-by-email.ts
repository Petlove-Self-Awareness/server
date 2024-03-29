import { Result } from '../../logic/result'
import { IUserModel } from '../../models/user-model'

export interface ILoadUserByIdUseCase {
  load: (value: string) => Promise<ILoadUserByIdUseCase.result>
}

export namespace ILoadUserByIdUseCase {
  export type result = Result<IUserModel>
}
