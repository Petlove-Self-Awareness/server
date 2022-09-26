import {
  HttpRequest,
  ok,
  serverError,
  unauthorized,
  IUserModel,
  UserRoles,
  ILoadUserByToken
} from './auth-middlware-protocols'
import { AuthMiddleware } from './auth-middleware'
import { Result } from '../../domain/logic/result'

const makeFakeUser = (): IUserModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  role: UserRoles.employee
})

const makeFakeRequest = (): HttpRequest => ({
  body: {},
  headers: { 'x-access-token': 'any_token' }
})

const makeLoadUserByTokenStub = (): ILoadUserByToken => {
  class LoadUserByTokenStub implements ILoadUserByToken {
    async load(token: string): Promise<Result<IUserModel>> {
      return Promise.resolve(Result.ok(makeFakeUser()))
    }
  }
  return new LoadUserByTokenStub()
}

type SutTypes = {
  loadUserByTokenStub: ILoadUserByToken
  sut: AuthMiddleware
}

const makeSut = (): SutTypes => {
  const loadUserByTokenStub = makeLoadUserByTokenStub()
  const sut = new AuthMiddleware(loadUserByTokenStub)
  return { loadUserByTokenStub, sut }
}

describe('AuthMiddleware', () => {
  test('Should return 401 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = { headers: {} }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should call LoadUserByToken with correct x-access-token', async () => {
    const { loadUserByTokenStub, sut } = makeSut()
    const loadSpy = jest.spyOn(loadUserByTokenStub, 'load')
    const httpRequest: HttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return 401 if LoadUserByToken returns fail', async () => {
    const { sut, loadUserByTokenStub } = makeSut()
    jest
      .spyOn(loadUserByTokenStub, 'load')
      .mockReturnValueOnce(Promise.resolve(Result.fail('example_fail')))
    const httpRequest: HttpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 200 if LoadUserByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ userId: 'valid_id' }))
  })

  test('Should return 500 if LoadUserByToken throws', async () => {
    const { sut, loadUserByTokenStub: loadAccountByTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const httpRequest: HttpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
