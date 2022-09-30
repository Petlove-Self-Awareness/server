import { Result } from '../../logic/result'
import { ISeniorityModel } from '../../models/seniority'

export interface ILoadSeniorityByIdUseCase {
  loadById: (id: string) => ILoadSeniorityByIdUseCase.result
}

export namespace ILoadSeniorityByIdUseCase {
  export type result = Result<ISeniorityModel>
}
