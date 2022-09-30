import { Result } from '../../logic/result'
import { ISeniorityModel } from '../../models/seniority'

export interface ILoadSenioritiesUseCase {
  loadAll: () => Promise<ILoadSenioritiesUseCase.result>
}

export namespace ILoadSenioritiesUseCase {
  export type result = Result<ISeniorityModel[]>
}
