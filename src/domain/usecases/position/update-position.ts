import { Result } from '../../logic/result'
import { IPositionModel } from '../../models/position'

export interface IUpdatePositionUseCase {
  update: (data: IUpdatePositionUseCase.params) => Promise<IUpdatePositionUseCase.result>
}

export namespace IUpdatePositionUseCase {
  export type params = Omit<IPositionModel, 'id'>
  export type result = Result<IPositionModel>
}
