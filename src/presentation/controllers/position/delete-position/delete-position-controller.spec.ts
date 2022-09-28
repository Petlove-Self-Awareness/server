import { DeletePositionController } from './delete-position-controller'
import {
  HttpRequest,
  IDeletePositionUseCase,
  noContent,
  notFound,
  Result,
  serverError,
  ServerError,
  unauthorized
} from './delete-position-protocols'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    positionId: 'any_id'
  },
  userId: 'any_account_id'
})

const makeFakePosition = (): Result<IDeletePositionUseCase.result> => {
  return Result.ok()
}

const makeDeletePositionUseCaseStub = (): IDeletePositionUseCase => {
  class DeletePositionByIdUseCaseStub implements IDeletePositionUseCase {
    delete(id: string): Promise<IDeletePositionUseCase.result> {
      return Promise.resolve(makeFakePosition())
    }
  }
  return new DeletePositionByIdUseCaseStub()
}

interface SutTypes {
  sut: DeletePositionController
  deletePositionUseCaseStub: IDeletePositionUseCase
}

const makeSut = (): SutTypes => {
  const deletePositionUseCaseStub = makeDeletePositionUseCaseStub()
  const sut = new DeletePositionController(deletePositionUseCaseStub)
  return {
    sut,
    deletePositionUseCaseStub
  }
}

describe('DeletePositionController', () => {
  test('Should call IDeletePositionUseCase with correct values', async () => {
    const { sut, deletePositionUseCaseStub } = makeSut()
    const useCaseSpy = jest.spyOn(deletePositionUseCaseStub, 'delete')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(useCaseSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return 500 if an IDeletePositionUseCase throws', async () => {
    const { sut, deletePositionUseCaseStub } = makeSut()
    jest
      .spyOn(deletePositionUseCaseStub, 'delete')
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 404 if usecase returns a fail', async () => {
    const { sut, deletePositionUseCaseStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest
      .spyOn(deletePositionUseCaseStub, 'delete')
      .mockReturnValueOnce(Promise.resolve(Result.fail('any_error_message')))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(notFound('any_error_message'))
  })

  test('Should return 401 if no user id is provided in request', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest().params
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 204 on deletion success', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(noContent())
  })
})
