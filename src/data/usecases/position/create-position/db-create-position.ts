import {
  ICreatePositionUseCase,
  ILoadPositionByNameRepository,
  IDBuilder,
  ICreatePositionRepository,
  Position,
  Result
} from './db-create-position-protocols'

export class DbCreatePositionUseCase implements ICreatePositionUseCase {
  constructor(
    private readonly idBuilder: IDBuilder,
    private readonly loadPositionByNameRepo: ILoadPositionByNameRepository,
    private readonly createPositionRepo: ICreatePositionRepository
  ) {}
  async create(name: string): Promise<ICreatePositionUseCase.result> {
    const id = this.idBuilder.createId()
    const validPosition = Position.create(name, id)
    if (validPosition.isFailure) {
      return Result.fail(validPosition.error)
    }
    const alreadyExists = await this.loadPositionByNameRepo.load(
      validPosition.getValue().name.value
    )
    if (alreadyExists) {
      return Result.fail('Position already exists')
    }
    await this.createPositionRepo.create({ id, positionName: name })
    return Result.ok({ id, positionName: name })
  }
}
