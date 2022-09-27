import { ICreatePositionUseCase } from './db-create-position-protocols'
import { ICreatePositionRepository } from '../../../protocols/db/position/create-position'
import { IDBuilder } from '../../../protocols/criptography'
import { Position } from '../../../../domain/models/position'
import { Result } from '../../load-user-by-token/db-load-user-by-token-protocols'

export class DbCreatePositionUseCase implements ICreatePositionUseCase {
  constructor(
    private readonly createPositionRepo: ICreatePositionRepository,
    private readonly idBuilder: IDBuilder
  ) {}
  async create(name: string): Promise<ICreatePositionUseCase.result> {
    const id = this.idBuilder.createId()
    const validPosition = Position.create(name, id)
    if (validPosition.isFailure) {
      return Result.fail(validPosition.error)
    }
    await this.createPositionRepo.create({ id, positionName: name })
    return Result.ok({ id, positionName: name })
  }
}
