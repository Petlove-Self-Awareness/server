import { IPositionModel } from '../../../../domain/models/position'

export interface ILoadPositionsRepository {
  loadAll: () => Promise<ILoadPositionsRepository.Result>
}

export namespace ILoadPositionsRepository {
  export type Result = IPositionModel[]
}
