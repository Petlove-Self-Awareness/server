import { ISeniorityModel } from '../../../../domain/models/seniority'

export interface ICreateSeniorityRepository {
  create: (seniorityData: ICreateSeniorityRepository.Params) => Promise<void>
}

export namespace ICreateSeniorityRepository {
  export type Params = ISeniorityModel
}
