import {
  IDeleteSeniorityUseCase,
  IDeleteSeniorityRepository,
  Result
} from './db-delete-seniority-protocols'

export class DbDeleteSeniority implements IDeleteSeniorityUseCase {
  constructor(private readonly deleteSeniorityRepo: IDeleteSeniorityRepository) {}
  async delete(id: string): Promise<IDeleteSeniorityUseCase.result> {
    const result = await this.deleteSeniorityRepo.delete(id)
    if (result === null) {
      return Result.fail('No seniority register was found')
    }
    return Result.ok('Seniority successfully deleted')
  }
}
