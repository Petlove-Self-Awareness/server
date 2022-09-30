import {
  ILoadSeniorityByIdUseCase,
  Result,
  ILoadSeniorityByIdRepository
} from './db-load-position-by-id-protocols'

export class DbLoadSeniorityById implements ILoadSeniorityByIdUseCase {
  constructor(
    private readonly loadSeniorityByIdRepository: ILoadSeniorityByIdRepository
  ) {}
  async loadById(id: string): Promise<ILoadSeniorityByIdUseCase.result> {
    const seniority = await this.loadSeniorityByIdRepository.loadById(id)
    if (!seniority) {
      return Result.fail('No seniority register was found')
    }
    return Result.ok(seniority)
  }
}
