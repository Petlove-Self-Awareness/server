import { IPositionModel } from '../../../../domain/models/position'

export interface ILoadPositionByIdRepository {
  loadById: (id: string) => Promise<ILoadPositionByIdRepository.Result>
}

export namespace ILoadPositionByIdRepository {
  export type Result = IPositionModel
}
