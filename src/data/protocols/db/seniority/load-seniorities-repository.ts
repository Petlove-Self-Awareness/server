import { ISeniorityModel } from '../../../usecases/seniority/create-seniority/db-create-seniority-protocols'

export interface ILoadSenioritiesRepository {
  loadAll: () => Promise<ILoadSenioritiesRepository.Result>
}

export namespace ILoadSenioritiesRepository {
  export type Result = ISeniorityModel[]
}
