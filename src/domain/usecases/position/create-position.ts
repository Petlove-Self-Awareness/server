import { IPositionModel } from '../../models/position'
import { Result } from '../../logic/result'

export interface ICreatePosition {
  create: (name: string) => Promise<ICreatePosition.result>
}

export namespace ICreatePosition {
  export type result = Result<IPositionModel>
}
