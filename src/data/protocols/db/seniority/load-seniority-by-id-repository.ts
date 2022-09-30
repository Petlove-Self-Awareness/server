import { ISeniorityModel } from '../../../../domain/models/seniority'

export interface ILoadSeniorityByIdRepository {
  loadById: (id: string) => Promise<ILoadSeniorityByIdRepository.Result>
}

export namespace ILoadSeniorityByIdRepository {
  export type Result = ISeniorityModel
}
