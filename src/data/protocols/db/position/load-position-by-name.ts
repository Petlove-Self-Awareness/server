import { IPositionModel } from '../../../../domain/models/position'

export interface ILoadPositionByNameRepository {
  load: (name: string) => Promise<ILoadPositionByNameRepository.Result>
}

export namespace ILoadPositionByNameRepository {
  export type Result = IPositionModel
}
