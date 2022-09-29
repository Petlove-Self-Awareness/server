import {
  IDeletePositionUseCase,
  IDeletePositionRepository,
  Result
} from './db-delete-position-protocols'

export class DbDeletePosition implements IDeletePositionUseCase {
  constructor(private readonly deletePositionRepo: IDeletePositionRepository) {}
  async delete(id: string): Promise<IDeletePositionUseCase.result> {
    const result = await this.deletePositionRepo.delete(id)
    if (result === null) {
      return Result.fail('No position register was found')
    }
    return Result.ok('Position successfully deleted')
  }
}
