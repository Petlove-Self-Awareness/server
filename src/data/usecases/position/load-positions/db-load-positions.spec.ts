import { ILoadPositionsRepository, Result } from './db-load-positions-protocols'
import { DbLoadPositions } from './db-load-positions'

const makeFakePositions = (): ILoadPositionsRepository.Result => [
  {
    id: 'valid_id',
    positionName: 'valid_name'
  },
  {
    id: 'another_id',
    positionName: 'another_name'
  }
]

const makeLoadPositionByIdRepoStub = (): ILoadPositionsRepository => {
  class LoadPositionsRepositoryStub implements ILoadPositionsRepository {
    async loadAll(): Promise<ILoadPositionsRepository.Result> {
      return Promise.resolve(makeFakePositions())
    }
  }
  return new LoadPositionsRepositoryStub()
}

type SutTypes = {
  loadPositionsRepositoryStub: ILoadPositionsRepository
  sut: DbLoadPositions
}

const makeSut = (): SutTypes => {
  const loadPositionsRepositoryStub = makeLoadPositionByIdRepoStub()
  const sut = new DbLoadPositions(loadPositionsRepositoryStub)
  return { sut, loadPositionsRepositoryStub }
}

describe('DbLoadPositions', () => {
  test('Should call LoadPositionsRepository', async () => {
    const { loadPositionsRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(loadPositionsRepositoryStub, 'loadAll')
    await sut.loadAll()
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return fail if LoadPositionsRepository returns null', async () => {
    const { loadPositionsRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadPositionsRepositoryStub, 'loadAll')
      .mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.loadAll()
    expect(account).toEqual(Result.fail('No position register was found'))
  })

  test('Should return an result with a position array on success', async () => {
    const { sut } = makeSut()
    const account = await sut.loadAll()
    expect(account).toEqual(Result.ok(makeFakePositions()))
  })

  test('Should throw if LoadPositionsRepository throws', async () => {
    const { loadPositionsRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadPositionsRepositoryStub, 'loadAll')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow()
  })
})
