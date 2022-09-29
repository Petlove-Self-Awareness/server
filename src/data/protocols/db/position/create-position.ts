import { IPositionModel } from '../../../../domain/models/position'

export interface ICreatePositionRepository {
  create: (positionData: ICreatePositionRepository.Params) => Promise<void>
}

export namespace ICreatePositionRepository {
  export type Params = IPositionModel
}
