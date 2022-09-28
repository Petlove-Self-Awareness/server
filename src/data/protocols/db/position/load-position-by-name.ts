import { IPositionModel } from '../../../../domain/models/position'

export interface ILoadPositionByNameRepository {
  loadByName: (name: string) => Promise<ILoadPositionByNameRepository.Result>
}

export namespace ILoadPositionByNameRepository {
  export type Result = IPositionModel
}
