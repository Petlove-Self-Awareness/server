import { DbLoadSeniorityById } from './db-load-seniority-by-id'
import { ILoadSeniorityByIdRepository, Result } from './db-load-position-by-id-protocols'

const makeFakeId = (): string => 'valid_id'

const makeFakeSeniority = (): ILoadSeniorityByIdRepository.Result => ({
  id: 'valid_id',
  seniorityName: 'valid_name'
})

const makeLoadRepositoryByIdRepoStub = (): ILoadSeniorityByIdRepository => {
  class LoadRepositoryByIdRepositoryStub implements ILoadSeniorityByIdRepository {
    async loadById(value: string): Promise<ILoadSeniorityByIdRepository.Result> {
      return Promise.resolve(makeFakeSeniority())
    }
  }
  return new LoadRepositoryByIdRepositoryStub()
}

type SutTypes = {
  loadRepositoryByIdRepositoryStub: ILoadSeniorityByIdRepository
  sut: DbLoadSeniorityById
}

const makeSut = (): SutTypes => {
  const loadRepositoryByIdRepositoryStub = makeLoadRepositoryByIdRepoStub()
  const sut = new DbLoadSeniorityById(loadRepositoryByIdRepositoryStub)
  return { sut, loadRepositoryByIdRepositoryStub }
}

describe('DbLoadseniorityById', () => {
  test('Should call ILoadSeniorityByIdRepository with correct values', async () => {
    const { loadRepositoryByIdRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(loadRepositoryByIdRepositoryStub, 'loadById')
    await sut.loadById(makeFakeId())
    expect(loadSpy).toHaveBeenCalledWith('valid_id')
  })

  test('Should return fail if ILoadSeniorityByIdRepository returns null', async () => {
    const { loadRepositoryByIdRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadRepositoryByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.loadById(makeFakeId())
    expect(account).toEqual(Result.fail('No seniority register was found'))
  })

  test('Should return an result with a seniority on success', async () => {
    const { sut } = makeSut()
    const account = await sut.loadById(makeFakeId())
    expect(account).toEqual(Result.ok(makeFakeSeniority()))
  })

  test('Should throw if ILoadSeniorityByIdRepository throws', async () => {
    const { loadRepositoryByIdRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadRepositoryByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.loadById(makeFakeId())
    await expect(promise).rejects.toThrow()
  })
})
