import { Result } from '../../logic/result'
import { IPositionModel } from '../../models/position'

export interface ILoadPositionById {
  load: (id: string) => Promise<ILoadPositionById.result>
}

export namespace ILoadPositionById {
  export type result = Result<IPositionModel>
}
