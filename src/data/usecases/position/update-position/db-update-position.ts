import {
  IUpdatePositionUseCase,
  Position,
  Result,
  ILoadPositionByNameRepository,
  ISavePositionRepository
} from './db-update-position-protocols'

export class DbUpdatePosition implements IUpdatePositionUseCase {
  constructor(
    private readonly loadSeniorityByNameRepo: ILoadPositionByNameRepository,
    private readonly savePositionRepo: ISavePositionRepository
  ) {}
  async update(
    data: IUpdatePositionUseCase.params
  ): Promise<IUpdatePositionUseCase.result> {
    const positionOrError = Position.create(data.positionName, data.id)
    if (positionOrError.isFailure) {
      return Result.fail(positionOrError.error)
    }
    const positionToUpdate = positionOrError.getValue()
    const positionAlreadyExists = await this.loadSeniorityByNameRepo.loadByName(
      positionToUpdate.name.value
    )
    if (positionAlreadyExists) {
      return Result.fail('Position name already exists')
    }
    const updated = positionToUpdate.convertToModel()
    const saved = await this.savePositionRepo.save(updated)
    if (saved === null) {
      return Result.fail(`Position with id ${data.id} was not found`)
    }
    return Result.ok(updated)
  }
}
