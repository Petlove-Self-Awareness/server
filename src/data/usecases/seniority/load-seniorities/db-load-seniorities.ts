import {
  ILoadSenioritiesRepository,
  ILoadSenioritiesUseCase,
  Result
} from './db-load-seniorities-protocols'

export class DbLoadSeniorities implements ILoadSenioritiesUseCase {
  constructor(private readonly loadSenioritiesRepo: ILoadSenioritiesRepository) {}
  async loadAll(): Promise<ILoadSenioritiesUseCase.result> {
    const seniorities = await this.loadSenioritiesRepo.loadAll()
    if (!seniorities) return Result.fail('No seniority register was found')
    return Result.ok(seniorities)
  }
}
