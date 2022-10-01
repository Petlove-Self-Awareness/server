import { UpdatePositionController } from './update-position-controller'
import {
  HttpRequest,
  IUpdatePositionUseCase,
  IPositionModel,
  IValidation,
  ok,
  Result,
  serverError,
  forbidden,
  ServerError,
  unauthorized,
  unprocessableEntity,
  UnauthorizedError,
  IUserModel,
  UserRoles,
  badRequest,
  MissingParamError,
  ILoadUserByIdUseCase
} from './update-position-controller-protocols'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    positionName: 'name_to_update'
  },
  params: { positionId: 'any_id' },
  userId: 'any_account_id'
})

const makeFakePosition = (): Result<IPositionModel> => {
  return Result.ok({
    id: 'any_id',
    positionName: 'name_to_update'
  })
}

const makeFakeUser = (): IUserModel => ({
  id: 'any_account_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  role: UserRoles.admin
})

const makeValidationStub = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeLoadUserUseCaseStub = (): ILoadUserByIdUseCase => {
  class LoadUserByIdUseCaseStub implements ILoadUserByIdUseCase {
    load(id: string): Promise<ILoadUserByIdUseCase.result> {
      return Promise.resolve(Result.ok(makeFakeUser()))
    }
  }
  return new LoadUserByIdUseCaseStub()
}

const makeUpdatePositionUseCaseStub = (): IUpdatePositionUseCase => {
  class UpdatePositionUseCaseStub implements IUpdatePositionUseCase {
    async update(
      data: IUpdatePositionUseCase.params
    ): Promise<IUpdatePositionUseCase.result> {
      return Promise.resolve(makeFakePosition())
    }
  }
  return new UpdatePositionUseCaseStub()
}

interface SutTypes {
  sut: UpdatePositionController
  updatePositionUseCaseStub: IUpdatePositionUseCase
  loadUserByIdUseCaseStub: ILoadUserByIdUseCase
  validationStub: IValidation
}

const makeSut = (): SutTypes => {
  const updatePositionUseCaseStub = makeUpdatePositionUseCaseStub()
  const loadUserByIdUseCaseStub = makeLoadUserUseCaseStub()
  const validationStub = makeValidationStub()
  const sut = new UpdatePositionController(
    validationStub,
    updatePositionUseCaseStub,
    loadUserByIdUseCaseStub
  )
  return {
    sut,
    updatePositionUseCaseStub,
    loadUserByIdUseCaseStub,
    validationStub
  }
}

describe('UpdatePositionController', () => {
  test('Should return 401 if userid is not provided', async () => {
    const { sut, loadUserByIdUseCaseStub: loadUserByEmailUseCaseStub } = makeSut()
    const httpRequest = {
      body: {
        positionName: 'name_to_update'
      },
      params: { positionId: 'any_id' }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should call LoadUserByIdUseCase with correct values', async () => {
    const { sut, loadUserByIdUseCaseStub: loadUserByEmailUseCaseStub } = makeSut()
    const useCaseSpy = jest.spyOn(loadUserByEmailUseCaseStub, 'load')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(useCaseSpy).toHaveBeenCalledWith('any_account_id')
  })

  test('Should return 500 if an LoadUserByIdUseCase throws', async () => {
    const { sut, loadUserByIdUseCaseStub } = makeSut()
    jest.spyOn(loadUserByIdUseCaseStub, 'load').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 403 if valid data is provided, but user is not an admin', async () => {
    const { sut, loadUserByIdUseCaseStub: loadUserByEmailUseCaseStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest.spyOn(loadUserByEmailUseCaseStub, 'load').mockReturnValueOnce(
      Promise.resolve(
        Result.ok({
          id: 'any_id',
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

  test('Should return 400 if positionId is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        positionName: 'name_to_update'
      },
      userId: 'any_accountId'
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('You must provide a "positionId" in params'))
    )
  })

  test('Should call IUpdatePositionUseCase with correct values', async () => {
    const { sut, updatePositionUseCaseStub } = makeSut()
    const useCaseSpy = jest.spyOn(updatePositionUseCaseStub, 'update')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(useCaseSpy).toHaveBeenCalledWith({
      id: 'any_id',
      positionName: 'name_to_update'
    })
  })

  test('Should return 500 if an IUpdatePositionUseCase throws', async () => {
    const { sut, updatePositionUseCaseStub } = makeSut()
    jest.spyOn(updatePositionUseCaseStub, 'update').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 422 if valid data is provided, but it cannot be processed', async () => {
    const { sut, updatePositionUseCaseStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest
      .spyOn(updatePositionUseCaseStub, 'update')
      .mockReturnValueOnce(Promise.resolve(Result.fail('any_error_message')))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unprocessableEntity('any_error_message'))
  })

  test('Should return 200 with a PositionModel if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakePosition().getValue()))
  })
})
