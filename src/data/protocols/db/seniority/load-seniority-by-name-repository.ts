import { ISeniorityModel } from '../../../../domain/models/seniority'

export interface ILoadSeniorityByNameRepository {
  loadByName: (name: string) => Promise<ILoadSeniorityByNameRepository.Result>
}

export namespace ILoadSeniorityByNameRepository {
  export type Result = ISeniorityModel
}
