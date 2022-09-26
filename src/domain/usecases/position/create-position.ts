import { IPositionModel } from '../../models/position'
import { Result } from '../../logic/result'

export interface ICreatePositionUseCase {
  create: (name: string) => Promise<ICreatePositionUseCase.result>
}

export namespace ICreatePositionUseCase {
  export type result = Result<IPositionModel>
}
