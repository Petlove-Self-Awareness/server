import {
  ILoadUserByIdUseCase,
  ILoadUserByEmailOrIdRepository,
  Result
} from './db-load-user-by-id-protocols'

export class DbLoadUserByUniqueKey implements ILoadUserByIdUseCase {
  constructor(private readonly loadUserByEmailOrIdRepo: ILoadUserByEmailOrIdRepository) {}
  async load(id: string): Promise<ILoadUserByIdUseCase.result> {
    const userOrNull = await this.loadUserByEmailOrIdRepo.loadUserByEmailOrId(id)
    if (!userOrNull) {
      return Result.fail('User was not found')
    }
    return Result.ok(userOrNull)
  }
}
