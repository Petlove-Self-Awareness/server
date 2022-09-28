import { DbLoadPositionById } from './db-load-position-by-id'
import {
  ILoadPositionByIdRepository,
  Result
} from './db-load-position-by-id-protocols'

const makeFakeId = (): string => 'valid_id'

const makeFakePosition = (): ILoadPositionByIdRepository.Result => ({
  id: 'valid_id',
  positionName: 'valid_name'
})

const makeLoadPositionByIdRepoStub = (): ILoadPositionByIdRepository => {
  class LoadPositionByIdRepositoryStub implements ILoadPositionByIdRepository {
    async loadById(value: string): Promise<ILoadPositionByIdRepository.Result> {
      return Promise.resolve(makeFakePosition())
    }
  }
  return new LoadPositionByIdRepositoryStub()
}

type SutTypes = {
  loadPositionByIdRepositoryStub: ILoadPositionByIdRepository
  sut: DbLoadPositionById
}

const makeSut = (): SutTypes => {
  const loadPositionByIdRepositoryStub = makeLoadPositionByIdRepoStub()
  const sut = new DbLoadPositionById(loadPositionByIdRepositoryStub)
  return { sut, loadPositionByIdRepositoryStub }
}

describe('DbLoadPositionById', () => {
  test('Should call LoadPositionByIdRepository with correct values', async () => {
    const { loadPositionByIdRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(loadPositionByIdRepositoryStub, 'loadById')
    await sut.load(makeFakeId())
    expect(loadSpy).toHaveBeenCalledWith('valid_id')
  })

  test('Should return fail if LoadPositionByIdRepository returns null', async () => {
    const { loadPositionByIdRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadPositionByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.load(makeFakeId())
    expect(account).toEqual(Result.fail('No position register was found'))
  })

  test('Should return an result with a position on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load(makeFakeId())
    expect(account).toEqual(Result.ok(makeFakePosition()))
  })

  test('Should throw if LoadPositionByIdRepository throws', async () => {
    const { loadPositionByIdRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadPositionByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load(makeFakeId())
    await expect(promise).rejects.toThrow()
  })
})
