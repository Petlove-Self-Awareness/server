import { IPositionModel } from '../../../../domain/models/position'

export interface ISavePositionRepository {
  save: (data: ISavePositionRepository.Params) => Promise<ISavePositionRepository.Result>
}

export namespace ISavePositionRepository {
  export type Params = IPositionModel
  export type Result = void
}
