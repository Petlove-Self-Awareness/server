import { LoadSeniorityByIdController } from './load-seniority-by-id-controller'
import {
  HttpRequest,
  ILoadSeniorityByIdUseCase,
  notFound,
  ok,
  Result,
  serverError,
  ServerError,
  unauthorized,
  ISeniorityModel
} from './load-seniority-by-id-protocols'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    seniorityId: 'any_id'
  },
  userId: 'any_account_id'
})

const makeFakeSeniority = (): Result<ISeniorityModel> => {
  return Result.ok({
    id: 'any_id',
    seniorityName: 'any_name'
  })
}

const makeLoadSeniorityByIdUseCaseStub = (): ILoadSeniorityByIdUseCase => {
  class LoadPositionByIdUseCaseStub implements ILoadSeniorityByIdUseCase {
    async loadById(id: string): Promise<ILoadSeniorityByIdUseCase.result> {
      return Promise.resolve(makeFakeSeniority())
    }
  }
  return new LoadPositionByIdUseCaseStub()
}

interface SutTypes {
  sut: LoadSeniorityByIdController
  loadSeniorityByIdUseCaseStub: ILoadSeniorityByIdUseCase
}

const makeSut = (): SutTypes => {
  const loadSeniorityByIdUseCaseStub = makeLoadSeniorityByIdUseCaseStub()
  const sut = new LoadSeniorityByIdController(loadSeniorityByIdUseCaseStub)
  return {
    sut,
    loadSeniorityByIdUseCaseStub
  }
}

describe('LoadSeniorityByIdController', () => {
  test('Should call ILoadSeniorityByIdUseCase with correct values', async () => {
    const { sut, loadSeniorityByIdUseCaseStub } = makeSut()
    const useCaseSpy = jest.spyOn(loadSeniorityByIdUseCaseStub, 'loadById')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(useCaseSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return 500 if an ILoadSeniorityByIdUseCase throws', async () => {
    const { sut, loadSeniorityByIdUseCaseStub } = makeSut()
    jest.spyOn(loadSeniorityByIdUseCaseStub, 'loadById').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 404 if usecase returns a fail', async () => {
    const { sut, loadSeniorityByIdUseCaseStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest
      .spyOn(loadSeniorityByIdUseCaseStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(Result.fail('any_error_message')))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(notFound('any_error_message'))
  })

  test('Should return 401 if no user id is provided in request', async () => {
    const { sut, loadSeniorityByIdUseCaseStub } = makeSut()
    const httpRequest = makeFakeRequest().params
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 200 with a SeniorityModel if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeSeniority().getValue()))
  })
})
