import { LoadSenioritiesController } from './load-seniorities-controller'
import {
  HttpRequest,
  ILoadSenioritiesUseCase,
  notFound,
  ok,
  Result,
  serverError,
  ServerError,
  unauthorized
} from './load-seniorities-controller-protocols'

const makeFakeRequest = (): HttpRequest => ({
  userId: 'any_account_id'
})

const makeFakeSeniorities = (): ILoadSenioritiesUseCase.result => {
  return Result.ok([
    {
      id: 'valid_id',
      seniorityName: 'valid_name'
    },
    {
      id: 'another_id',
      seniorityName: 'another_name'
    }
  ])
}
const makeLoadPositionUseCaseStub = (): ILoadSenioritiesUseCase => {
  class LoadSenioritiesUseCaseStub implements ILoadSenioritiesUseCase {
    loadAll(): Promise<ILoadSenioritiesUseCase.result> {
      return Promise.resolve(makeFakeSeniorities())
    }
  }
  return new LoadSenioritiesUseCaseStub()
}

interface SutTypes {
  sut: LoadSenioritiesController
  loadSenioritiesUseCaseStub: ILoadSenioritiesUseCase
}

const makeSut = (): SutTypes => {
  const loadSenioritiesUseCaseStub = makeLoadPositionUseCaseStub()
  const sut = new LoadSenioritiesController(loadSenioritiesUseCaseStub)
  return {
    sut,
    loadSenioritiesUseCaseStub
  }
}

describe('LoadSenioritiesController', () => {
  test('Should call ILoadSenioritiesUseCase with correct values', async () => {
    const { sut, loadSenioritiesUseCaseStub } = makeSut()
    const useCaseSpy = jest.spyOn(loadSenioritiesUseCaseStub, 'loadAll')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(useCaseSpy).toHaveBeenCalled()
  })

  test('Should return 500 if an ILoadSenioritiesUseCase throws', async () => {
    const { sut, loadSenioritiesUseCaseStub } = makeSut()
    jest
      .spyOn(loadSenioritiesUseCaseStub, 'loadAll')
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 404 if usecase returns a fail', async () => {
    const { sut, loadSenioritiesUseCaseStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest
      .spyOn(loadSenioritiesUseCaseStub, 'loadAll')
      .mockReturnValueOnce(Promise.resolve(Result.fail('any_error_message')))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(notFound('any_error_message'))
  })

  test('Should return 401 if no user id is provided in request', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 200 with a SeniorityModel array on success', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeSeniorities().getValue()))
  })
})
