import { LoadPositionsController } from './load-positions-controller'
import {
  HttpRequest,
  ILoadPositions,
  notFound,
  ok,
  Result,
  serverError,
  ServerError,
  unauthorized
} from './load-positions-controller-protocols'

const makeFakeRequest = (): HttpRequest => ({
  userId: 'any_account_id'
})

const makeFakePositions = (): ILoadPositions.result => {
  return Result.ok([
    {
      id: 'valid_id',
      positionName: 'valid_name'
    },
    {
      id: 'another_id',
      positionName: 'another_name'
    }
  ])
}
const makeLoadPositionUseCaseStub = (): ILoadPositions => {
  class LoadPositionByIdUseCaseStub implements ILoadPositions {
    loadAll(): Promise<ILoadPositions.result> {
      return Promise.resolve(makeFakePositions())
    }
  }
  return new LoadPositionByIdUseCaseStub()
}

interface SutTypes {
  sut: LoadPositionsController
  loadPositionsUseCaseStub: ILoadPositions
}

const makeSut = (): SutTypes => {
  const loadPositionsUseCaseStub = makeLoadPositionUseCaseStub()
  const sut = new LoadPositionsController(loadPositionsUseCaseStub)
  return {
    sut,
    loadPositionsUseCaseStub
  }
}

describe('LoadPositionsController', () => {
  test('Should call LoadPositionsUseCase with correct values', async () => {
    const { sut, loadPositionsUseCaseStub } = makeSut()
    const useCaseSpy = jest.spyOn(loadPositionsUseCaseStub, 'loadAll')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(useCaseSpy).toHaveBeenCalled()
  })

  test('Should return 500 if an LoadPositionsUseCase throws', async () => {
    const { sut, loadPositionsUseCaseStub: loadPositionByIdUseCaseStub } =
      makeSut()
    jest
      .spyOn(loadPositionByIdUseCaseStub, 'loadAll')
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 404 if usecase returns a fail', async () => {
    const { sut, loadPositionsUseCaseStub: loadPositionByIdUseCaseStub } =
      makeSut()
    const httpRequest = makeFakeRequest()
    jest
      .spyOn(loadPositionByIdUseCaseStub, 'loadAll')
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

  test('Should return 200 with a PositionModel array on success', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakePositions().getValue()))
  })
})
