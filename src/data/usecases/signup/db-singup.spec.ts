import { Result } from '../../../domain/logic/result'
import { DbSignUp } from './db-signup'
import {
  IHasher,
  ILoadUserByEmailOrIdRepository,
  ISignupRepository,
  IUserModel,
  SignupData,
  IDBuilder,
  UserRoles
} from './db-signup-protocols'

const makeFakeAccount = (): IUserModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
  role: UserRoles.employee
})

const makeFakeAccountData = (): SignupData => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
  role: UserRoles.employee
})

const makeHasher = (): IHasher => {
  class HasherStub implements IHasher {
    async hash(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

const makeIdBuilder = (): IDBuilder => {
  class IdBuilderStub implements IDBuilder {
    createId(): string {
      return 'valid_id'
    }
  }
  return new IdBuilderStub()
}

const makeSignupRepositoryStub = (): ISignupRepository => {
  class SignupRepositoryStub implements ISignupRepository {
    async signup(data: IUserModel): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new SignupRepositoryStub()
}

const makeLoadUserByEmailOrIdRepositoryStub =
  (): ILoadUserByEmailOrIdRepository => {
    class LoadAccountByEmailRepositoryStub
      implements ILoadUserByEmailOrIdRepository
    {
      async loadUserByEmailOrId(value: string): Promise<Result<IUserModel>> {
        return new Promise(resolve =>
          resolve(Result.fail<IUserModel>('User was not found'))
        )
      }
    }
    return new LoadAccountByEmailRepositoryStub()
  }

interface ISutTypes {
  sut: DbSignUp
  hasherStub: IHasher
  idBuilderStub: IDBuilder
  signupRepositoryStub: ISignupRepository
  loadUserByEmailOrIdRepositoryStub: ILoadUserByEmailOrIdRepository
}

const makeSut = (): ISutTypes => {
  const hasherStub = makeHasher()
  const signupRepositoryStub = makeSignupRepositoryStub()
  const loadUserByEmailOrIdRepositoryStub =
    makeLoadUserByEmailOrIdRepositoryStub()
  const idBuilderStub = makeIdBuilder()
  const sut = new DbSignUp(
    hasherStub,
    idBuilderStub,
    loadUserByEmailOrIdRepositoryStub,
    signupRepositoryStub
  )
  return {
    sut,
    hasherStub,
    idBuilderStub,
    signupRepositoryStub,
    loadUserByEmailOrIdRepositoryStub
  }
}

describe('DbSignup Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    await sut.signUp(makeFakeAccountData())
    expect(hasherSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest
      .spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.signUp(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadUserByEmailOrIdRepository with correct values', async () => {
    const { sut, loadUserByEmailOrIdRepositoryStub } = makeSut()
    const loadUserSpy = jest.spyOn(
      loadUserByEmailOrIdRepositoryStub,
      'loadUserByEmailOrId'
    )
    await sut.signUp(makeFakeAccountData())
    expect(loadUserSpy).toHaveBeenCalledWith('valid_email')
  })

  test('Should throw if LoadUserByEmailOrIdRepository throws', async () => {
    const { sut, loadUserByEmailOrIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadUserByEmailOrIdRepositoryStub, 'loadUserByEmailOrId')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.signUp(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return fail if LoadUserByEmailOrIdRepository finds an user', async () => {
    const { sut, loadUserByEmailOrIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadUserByEmailOrIdRepositoryStub, 'loadUserByEmailOrId')
      .mockReturnValueOnce(
        new Promise(resolve =>
          resolve(Result.ok<IUserModel>(makeFakeAccount()))
        )
      )
    const user = await sut.signUp(makeFakeAccountData())
    expect(user).toEqual(Result.fail('User email is already being used'))
  })

  test('Should call IdBuilder', async () => {
    const { sut, idBuilderStub } = makeSut()
    const idBuilderSpy = jest.spyOn(idBuilderStub, 'createId')
    await sut.signUp(makeFakeAccountData())
    expect(idBuilderSpy).toHaveBeenCalled()
  })

  test('Should call SignupRepository with correct values', async () => {
    const { sut, signupRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(signupRepositoryStub, 'signup')
    await sut.signUp(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
      id: 'valid_id',
      role: 'employee'
    })
  })

  test('Should throw if SignupRepository throws', async () => {
    const { sut, signupRepositoryStub } = makeSut()
    jest
      .spyOn(signupRepositoryStub, 'signup')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.signUp(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return successfull result on success', async () => {
    const { sut } = makeSut()
    const account = await sut.signUp(makeFakeAccountData())
    expect(account).toEqual(Result.ok<IUserModel>(makeFakeAccount()))
  })
})
