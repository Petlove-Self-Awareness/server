import { DbLoadUserByEmail } from './db-load-user-by-id'
import {
  ILoadUserByEmailOrIdRepository,
  Result,
  UserRoles
} from './db-load-user-by-id-protocols'

const makeFakeId = (): string => 'valid_id'

const makeFakeUser = (): ILoadUserByEmailOrIdRepository.Result => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
  role: UserRoles.employee
})

const makeLoadUserByIdRepoStub = (): ILoadUserByEmailOrIdRepository => {
  class LoadUserByIdRepositoryStub implements ILoadUserByEmailOrIdRepository {
    async loadUserByEmailOrId(
      value: string
    ): Promise<ILoadUserByEmailOrIdRepository.Result> {
      return Promise.resolve(makeFakeUser())
    }
  }
  return new LoadUserByIdRepositoryStub()
}

type SutTypes = {
  loadUserByIdRepositoryStub: ILoadUserByEmailOrIdRepository
  sut: DbLoadUserByEmail
}

const makeSut = (): SutTypes => {
  const loadUserByIdRepositoryStub = makeLoadUserByIdRepoStub()
  const sut = new DbLoadUserByEmail(loadUserByIdRepositoryStub)
  return { sut, loadUserByIdRepositoryStub }
}

describe('DbLoadUserByEmail', () => {
  test('Should call LoadUserByIdRepository with correct values', async () => {
    const { loadUserByIdRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(
      loadUserByIdRepositoryStub,
      'loadUserByEmailOrId'
    )
    await sut.load(makeFakeId())
    expect(loadSpy).toHaveBeenCalledWith('valid_id')
  })

  test('Should return fail if LoadUserByIdRepository returns null', async () => {
    const { loadUserByIdRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadUserByIdRepositoryStub, 'loadUserByEmailOrId')
      .mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.load(makeFakeId())
    expect(account).toEqual(Result.fail('User was not found'))
  })

  test('Should return an result with an user on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load(makeFakeId())
    expect(account).toEqual(Result.ok(makeFakeUser()))
  })

  test('Should throw if LoadUserByIdRepository throws', async () => {
    const { loadUserByIdRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadUserByIdRepositoryStub, 'loadUserByEmailOrId')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load(makeFakeId())
    await expect(promise).rejects.toThrow()
  })
})
