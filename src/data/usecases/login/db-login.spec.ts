import { DbAuthentication } from './db-login'
import {
  IEncrypter,
  IHashComparer,
  ILoadUserByEmailOrIdRepository,
  AuthenticationModel,
  IUserModel,
  Result,
  UserRoles
} from './db-login-protocols'

const makeFakeAccount = (): IUserModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  name: 'any_name',
  role: UserRoles.employee
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepositoryStub =
  (): ILoadUserByEmailOrIdRepository => {
    class LoadUserByEmailOrIdRepositoryStub
      implements ILoadUserByEmailOrIdRepository
    {
      async loadUserByEmailOrId(value: string): Promise<Result<IUserModel>> {
        return new Promise(resolve => resolve(Result.ok(makeFakeAccount())))
      }
    }
    return new LoadUserByEmailOrIdRepositoryStub()
  }

const makeHashComparerStub = (): IHashComparer => {
  class HashComparerStub implements IHashComparer {
    async compare(value: string, hashedValue: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeEncrypterStub = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    encrypt(id: string): string {
      return 'any_token'
    }
  }
  return new EncrypterStub()
}

type SutTypes = {
  sut: DbAuthentication
  loadUserByEmailOrIdRepositoryStub: ILoadUserByEmailOrIdRepository
  hashComparerStub: IHashComparer
  encrypterStub: IEncrypter
}

const makeSut = (): SutTypes => {
  const loadUserByEmailOrIdRepositoryStub =
    makeLoadAccountByEmailRepositoryStub()
  const hashComparerStub = makeHashComparerStub()
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAuthentication(
    loadUserByEmailOrIdRepositoryStub,
    hashComparerStub,
    encrypterStub
  )
  return {
    sut,
    loadUserByEmailOrIdRepositoryStub,
    hashComparerStub,
    encrypterStub
  }
}

describe('DbAuthentication Usecase', () => {
  test('Should call LoadUserByEmailOrIdRepository with correct email', async () => {
    const { loadUserByEmailOrIdRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(
      loadUserByEmailOrIdRepositoryStub,
      'loadUserByEmailOrId'
    )
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadUserByEmailOrIdRepository throws', async () => {
    const { loadUserByEmailOrIdRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadUserByEmailOrIdRepositoryStub, 'loadUserByEmailOrId')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return fail if LoadUserByEmailOrIdRepository returns fail', async () => {
    const { loadUserByEmailOrIdRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadUserByEmailOrIdRepositoryStub, 'loadUserByEmailOrId')
      .mockReturnValueOnce(
        new Promise(resolve =>
          resolve(Result.fail('User email or password is/are incorrect'))
        )
      )
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toEqual(
      Result.fail('User email or password is/are incorrect')
    )
  })

  test('Should call HashComparer with correct values', async () => {
    const { hashComparerStub, sut } = makeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(comparerSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { hashComparerStub, sut } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return fail if HashComparer returns false', async () => {
    const { hashComparerStub, sut } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toEqual(
      Result.fail('User email or password is/are incorrect')
    )
  })

  test('Should call Encrypter with correct id', async () => {
    const { encrypterStub, sut } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if Encrypter throws', async () => {
    const { encrypterStub, sut } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return a token on success', async () => {
    const { sut } = makeSut()
    const token = await sut.auth(makeFakeAuthentication())
    expect(token).toEqual(Result.ok('any_token'))
  })
})
