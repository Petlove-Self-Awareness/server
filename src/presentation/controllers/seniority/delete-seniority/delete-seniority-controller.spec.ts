import { DeleteSeniorityController } from './delete-seniority-controller'
import {
  HttpRequest,
  IDeleteSeniorityUseCase,
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
} from './delete-seniority-protocols'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    seniorityId: 'any_id'
  },
  userId: 'any_account_id'
})

const makeFakePosition = (): Result<IDeleteSeniorityUseCase.result> => {
  return Result.ok()
}

const makeFakeUser = (): IUserModel => ({
  id: 'any_account_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  role: UserRoles.admin
})

const makeDeleteSeniorityUseCaseStub = (): IDeleteSeniorityUseCase => {
  class DeletePositionByIdUseCaseStub implements IDeleteSeniorityUseCase {
    delete(id: string): Promise<IDeleteSeniorityUseCase.result> {
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
  sut: DeleteSeniorityController
  deleteSeniorityUseCaseStub: IDeleteSeniorityUseCase
  loadUserByIdUseCaseStub: ILoadUserByIdUseCase
}

const makeSut = (): SutTypes => {
  const deleteSeniorityUseCaseStub = makeDeleteSeniorityUseCaseStub()
  const loadUserByIdUseCaseStub = makeLoadUserUseCaseStub()
  const sut = new DeleteSeniorityController(
    deleteSeniorityUseCaseStub,
    loadUserByIdUseCaseStub
  )
  return {
    sut,
    deleteSeniorityUseCaseStub,
    loadUserByIdUseCaseStub
  }
}

describe('DeleteSeniorityController', () => {
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

  test('Should call IDeleteSeniorityUseCase with correct values', async () => {
    const { sut, deleteSeniorityUseCaseStub } = makeSut()
    const useCaseSpy = jest.spyOn(deleteSeniorityUseCaseStub, 'delete')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(useCaseSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return 500 if an IDeleteSeniorityUseCase throws', async () => {
    const { sut, deleteSeniorityUseCaseStub } = makeSut()
    jest
      .spyOn(deleteSeniorityUseCaseStub, 'delete')
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 404 if usecase returns a fail', async () => {
    const { sut, deleteSeniorityUseCaseStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest
      .spyOn(deleteSeniorityUseCaseStub, 'delete')
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
