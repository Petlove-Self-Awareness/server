import { IPositionModel } from '../../models/position'

export interface ILoadPositionById {
  load: (id: string) => Promise<ILoadPositionById.Result>
}

export namespace ILoadPositionById {
  export type Result = IPositionModel
}
