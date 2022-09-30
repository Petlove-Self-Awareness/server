import {
  ICreateSeniorityRepository,
  ICreateSeniorityUseCase,
  IDBuilder,
  ILoadSeniorityByNameRepository,
  Result,
  Seniority
} from './db-create-seniority-protocols'

export class DbCreateSeniorityUseCase implements ICreateSeniorityUseCase {
  constructor(
    private readonly idBuilder: IDBuilder,
    private readonly loadSeniorityByNameRepo: ILoadSeniorityByNameRepository,
    private readonly createSeniorityRepo: ICreateSeniorityRepository
  ) {}
  async create(name: string): Promise<ICreateSeniorityUseCase.result> {
    const id = this.idBuilder.createId()
    const seniorityOrError = Seniority.create(name, id)
    if (seniorityOrError.isFailure) {
      return Result.fail(seniorityOrError.error)
    }
    const seniorityExists = await this.loadSeniorityByNameRepo.loadByName(
      seniorityOrError.getValue().name.value
    )
    if (seniorityExists) {
      return Result.fail('Seniority already exists')
    }
    await this.createSeniorityRepo.create({
      id,
      seniorityName: seniorityOrError.getValue().name.value
    })
    return Result.ok({
      id,
      seniorityName: seniorityOrError.getValue().name.value
    })
  }
}
