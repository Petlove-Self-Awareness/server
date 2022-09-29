import { DbDeletePosition } from './db-delete-position'
import {
  IDeletePositionRepository,
  Result
} from './db-delete-position-protocols'

const makeFakeId = (): string => 'valid_id'

const makeDeletePositionByIdRepoStub = (): IDeletePositionRepository => {
  class DeletePositionByIdRepositoryStub implements IDeletePositionRepository {
    async delete(value: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new DeletePositionByIdRepositoryStub()
}

type SutTypes = {
  deletePositionByIdRepositoryStub: IDeletePositionRepository
  sut: DbDeletePosition
}

const makeSut = (): SutTypes => {
  const deletePositionByIdRepositoryStub = makeDeletePositionByIdRepoStub()
  const sut = new DbDeletePosition(deletePositionByIdRepositoryStub)
  return { sut, deletePositionByIdRepositoryStub }
}

describe('DbDeletePosition', () => {
  test('Should call IDeletePositionRepository with correct values', async () => {
    const { deletePositionByIdRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(deletePositionByIdRepositoryStub, 'delete')
    await sut.delete(makeFakeId())
    expect(loadSpy).toHaveBeenCalledWith('valid_id')
  })

  test('Should return fail if IDeletePositionRepository returns null', async () => {
    const {
      deletePositionByIdRepositoryStub: loadPositionByIdRepositoryStub,
      sut
    } = makeSut()
    jest
      .spyOn(loadPositionByIdRepositoryStub, 'delete')
      .mockReturnValueOnce(Promise.resolve(null))
    const result = await sut.delete(makeFakeId())
    expect(result).toEqual(Result.fail('No position register was found'))
  })

  test('Should return an ok result on success', async () => {
    const { sut } = makeSut()
    const account = await sut.delete(makeFakeId())
    expect(account).toEqual(Result.ok('Position successfully deleted'))
  })

  test('Should throw if LoadPositionByIdRepository throws', async () => {
    const { deletePositionByIdRepositoryStub, sut } = makeSut()
    jest
      .spyOn(deletePositionByIdRepositoryStub, 'delete')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.delete(makeFakeId())
    await expect(promise).rejects.toThrow()
  })
})
