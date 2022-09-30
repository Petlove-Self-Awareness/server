import { ILoadSenioritiesRepository, Result } from './db-load-seniorities-protocols'
import { DbLoadSeniorities } from './db-load-seniorities'

const makeFakeSeniorities = (): ILoadSenioritiesRepository.Result => [
  {
    id: 'valid_id',
    seniorityName: 'valid_name'
  },
  {
    id: 'another_id',
    seniorityName: 'another_name'
  }
]

const makeLoadPositionByIdRepoStub = (): ILoadSenioritiesRepository => {
  class LoadPositionsRepositoryStub implements ILoadSenioritiesRepository {
    async loadAll(): Promise<ILoadSenioritiesRepository.Result> {
      return Promise.resolve(makeFakeSeniorities())
    }
  }
  return new LoadPositionsRepositoryStub()
}

type SutTypes = {
  loadSenioritiesRepositoryStub: ILoadSenioritiesRepository
  sut: DbLoadSeniorities
}

const makeSut = (): SutTypes => {
  const loadSenioritiesRepositoryStub = makeLoadPositionByIdRepoStub()
  const sut = new DbLoadSeniorities(loadSenioritiesRepositoryStub)
  return { sut, loadSenioritiesRepositoryStub }
}

describe('DbLoadSeniorities', () => {
  test('Should call ILoadSenioritiesRepository', async () => {
    const { loadSenioritiesRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(loadSenioritiesRepositoryStub, 'loadAll')
    await sut.loadAll()
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return fail if ILoadSenioritiesRepository returns null', async () => {
    const { loadSenioritiesRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadSenioritiesRepositoryStub, 'loadAll')
      .mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.loadAll()
    expect(account).toEqual(Result.fail('No seniority register was found'))
  })

  test('Should return an result with a seniority array on success', async () => {
    const { sut } = makeSut()
    const account = await sut.loadAll()
    expect(account).toEqual(Result.ok(makeFakeSeniorities()))
  })

  test('Should throw if ILoadSenioritiesRepository throws', async () => {
    const { loadSenioritiesRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadSenioritiesRepositoryStub, 'loadAll')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow()
  })
})
