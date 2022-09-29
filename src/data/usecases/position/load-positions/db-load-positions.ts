import { ILoadPositions } from './db-load-positions-protocols'
import { Result, ILoadPositionsRepository } from './db-load-positions-protocols'

export class DbLoadPositions implements ILoadPositions {
  constructor(
    private readonly loadAllPositionsRepo: ILoadPositionsRepository
  ) {}
  async loadAll(): Promise<ILoadPositions.result> {
    const positions = await this.loadAllPositionsRepo.loadAll()
    if (!positions) {
      return Result.fail('No position register was found')
    }
    return Result.ok(positions)
  }
}
