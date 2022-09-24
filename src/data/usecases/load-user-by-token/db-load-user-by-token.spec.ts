import { DbLoadAccountByToken } from './db-load-user-by-token'
import {
  IUserModel,
  IDecrypter,
  ILoadUserByEmailOrIdRepository,
  UserRoles,
  Result
} from './db-load-user-by-token-protocols'

const makeFakeToken = (): string => 'any_token'

const makeFakeAccount = (): IUserModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
  role: UserRoles.employee
})

const makeDecrypterStub = (): IDecrypter => {
  class DecrypterStub implements IDecrypter {
    decrypt(token: string): string {
      return 'any_id'
    }
  }
  return new DecrypterStub()
}

const makeLoadUserByTokenRepoStub = (): ILoadUserByEmailOrIdRepository => {
  class LoadAccountByTokenRepositoryStub
    implements ILoadUserByEmailOrIdRepository
  {
    async loadUserByEmailOrId(value: string): Promise<Result<IUserModel>> {
      return Promise.resolve(Result.ok(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

type SutTypes = {
  decrypterStub: IDecrypter
  loadAccountByTokenRepositoryStub: ILoadUserByEmailOrIdRepository
  sut: DbLoadAccountByToken
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const loadAccountByTokenRepositoryStub = makeLoadUserByTokenRepoStub()
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  )
  return { sut, decrypterStub, loadAccountByTokenRepositoryStub }
}

describe('DbLoadAccountByToken', () => {
  test('Should call Decrypter with correct values', async () => {
    const { decrypterStub, sut } = makeSut()
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load(makeFakeToken())
    expect(decrypterSpy).toHaveBeenCalledWith(makeFakeToken())
  })

  test('Should return fail if Decrypter returns null', async () => {
    const { decrypterStub, sut } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(null)
    const user = await sut.load(makeFakeToken())
    expect(user).toEqual(Result.fail('User was not found'))
  })

  test('Should call LoadUserByTokenRepository with correct values', async () => {
    const { loadAccountByTokenRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadUserByEmailOrId'
    )
    await sut.load(makeFakeToken())
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return fail if LoadUserByTokenRepository returns fail', async () => {
    const { loadAccountByTokenRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadUserByEmailOrId')
      .mockReturnValueOnce(
        new Promise(resolve => resolve(Result.fail('any_message')))
      )
    const account = await sut.load(makeFakeToken())
    expect(account).toEqual(Result.fail('any_message'))
  })

  test('Should return an result with an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load(makeFakeToken())
    expect(account).toEqual(Result.ok(makeFakeAccount()))
  })

  test('Should throw if Decrypter throws', async () => {
    const { decrypterStub, sut } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.load(makeFakeToken())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { loadAccountByTokenRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadUserByEmailOrId')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.load(makeFakeToken())
    await expect(promise).rejects.toThrow()
  })
})
