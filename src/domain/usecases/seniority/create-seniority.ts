import { ISeniorityModel } from '../../models/seniority'

export interface ICreateSeniorityUseCase {
  create: (name: string) => Promise<ICreateSeniorityUseCase.Result>
}

export namespace ICreateSeniorityUseCase {
  export type Result = ISeniorityModel
}
