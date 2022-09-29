import { Result } from '../../logic/result'
import { ISeniorityModel } from '../../models/seniority'

export interface ICreateSeniorityUseCase {
  create: (name: string) => Promise<ICreateSeniorityUseCase.result>
}

export namespace ICreateSeniorityUseCase {
  export type result = Result<ISeniorityModel>
}
