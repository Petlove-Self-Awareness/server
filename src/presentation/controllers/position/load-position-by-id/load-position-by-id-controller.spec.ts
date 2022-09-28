import { LoadPositionByIdController } from './load-position-by-id-controller'
import {
  HttpRequest,
  ILoadPositionById,
  IPositionModel,
  notFound,
  ok,
  Result,
  serverError,
  ServerError,
  unauthorized
} from './load-position-by-id-protocols'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    positionId: 'any_name'
  },
  userId: 'any_account_id'
})

const makeFakePosition = (): Result<IPositionModel> => {
  return Result.ok({
    id: 'any_id',
    positionName: 'any_name'
  })
}

const makeLoadPositionUseCaseStub = (): ILoadPositionById => {
  class LoadPositionByIdUseCaseStub implements ILoadPositionById {
    load(id: string): Promise<ILoadPositionById.result> {
      return Promise.resolve(makeFakePosition())
    }
  }
  return new LoadPositionByIdUseCaseStub()
}

interface SutTypes {
  sut: LoadPositionByIdController
  loadPositionByIdUseCaseStub: ILoadPositionById
}

const makeSut = (): SutTypes => {
  const loadPositionByIdUseCaseStub = makeLoadPositionUseCaseStub()
  const sut = new LoadPositionByIdController(loadPositionByIdUseCaseStub)
  return {
    sut,
    loadPositionByIdUseCaseStub
  }
}

describe('LoadPositionByIdController', () => {
  test('Should call LoadPositionByIdUseCase with correct values', async () => {
    const { sut, loadPositionByIdUseCaseStub } = makeSut()
    const useCaseSpy = jest.spyOn(loadPositionByIdUseCaseStub, 'load')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(useCaseSpy).toHaveBeenCalledWith('any_name')
  })

  test('Should return 500 if an LoadPositionByIdUseCase throws', async () => {
    const { sut, loadPositionByIdUseCaseStub } = makeSut()
    jest
      .spyOn(loadPositionByIdUseCaseStub, 'load')
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 404 if usecase returns a fail', async () => {
    const { sut, loadPositionByIdUseCaseStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest
      .spyOn(loadPositionByIdUseCaseStub, 'load')
      .mockReturnValueOnce(Promise.resolve(Result.fail('any_error_message')))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(notFound('any_error_message'))
  })

  test('Should return 401 if no user id is provided in request', async () => {
    const { sut, loadPositionByIdUseCaseStub } = makeSut()
    const httpRequest = makeFakeRequest().params
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 200 with a PositionModel if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakePosition().getValue()))
  })
})
