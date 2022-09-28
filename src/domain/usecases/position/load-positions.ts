import { Result } from '../../logic/result'
import { IPositionModel } from '../../models/position'

export interface ILoadPositions {
  loadAll: () => Promise<ILoadPositions.result>
}

export namespace ILoadPositions {
  export type result = Result<IPositionModel[]>
}
