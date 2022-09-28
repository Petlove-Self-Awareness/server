import {
  ILoadPositionById,
  Result,
  ILoadPositionByIdRepository
} from './db-load-position-by-id-protocols'

export class DbLoadPositionById implements ILoadPositionById {
  constructor(
    private readonly loadPositionByIdRepository: ILoadPositionByIdRepository
  ) {}
  async load(id: string): Promise<ILoadPositionById.result> {
    const position = await this.loadPositionByIdRepository.loadById(id)
    if (!position) {
      return Result.fail('No position register was found')
    }
    return Result.ok(position)
  }
}
