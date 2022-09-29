import { DeletePositionController } from './delete-position-controller'
import {
  HttpRequest,
  IDeletePositionUseCase,
  ILoadUserByIdUseCase,
  noContent,
  notFound,
  Result,
  serverError,
  ServerError,
  unauthorized,
  UserRoles,
  IUserModel,
  forbidden,
  UnauthorizedError
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

const makeFakeUser = (): IUserModel => ({
  id: 'any_account_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  role: UserRoles.admin
})

const makeDeletePositionUseCaseStub = (): IDeletePositionUseCase => {
  class DeletePositionByIdUseCaseStub implements IDeletePositionUseCase {
    delete(id: string): Promise<IDeletePositionUseCase.result> {
      return Promise.resolve(makeFakePosition())
    }
  }
  return new DeletePositionByIdUseCaseStub()
}

const makeLoadUserUseCaseStub = (): ILoadUserByIdUseCase => {
  class LoadUserByIdUseCaseStub implements ILoadUserByIdUseCase {
    load(id: string): Promise<ILoadUserByIdUseCase.result> {
      return Promise.resolve(Result.ok(makeFakeUser()))
    }
  }
  return new LoadUserByIdUseCaseStub()
}

interface SutTypes {
  sut: DeletePositionController
  deletePositionUseCaseStub: IDeletePositionUseCase
  loadUserByIdUseCaseStub: ILoadUserByIdUseCase
}

const makeSut = (): SutTypes => {
  const deletePositionUseCaseStub = makeDeletePositionUseCaseStub()
  const loadUserByIdUseCaseStub = makeLoadUserUseCaseStub()
  const sut = new DeletePositionController(
    deletePositionUseCaseStub,
    loadUserByIdUseCaseStub
  )
  return {
    sut,
    deletePositionUseCaseStub,
    loadUserByIdUseCaseStub
  }
}

describe('DeletePositionController', () => {
  test('Should call LoadUserByIdUseCase with correct values', async () => {
    const { sut, loadUserByIdUseCaseStub } = makeSut()
    const useCaseSpy = jest.spyOn(loadUserByIdUseCaseStub, 'load')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(useCaseSpy).toHaveBeenCalledWith('any_account_id')
  })

  test('Should return 403 user is not an admin', async () => {
    const { sut, loadUserByIdUseCaseStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest.spyOn(loadUserByIdUseCaseStub, 'load').mockReturnValueOnce(
      Promise.resolve(
        Result.ok({
          id: 'any_account_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          role: UserRoles.manager
        })
      )
    )
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new UnauthorizedError()))
  })

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
