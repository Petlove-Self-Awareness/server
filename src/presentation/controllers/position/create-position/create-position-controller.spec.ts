import { CreatePositionController } from './create-position-controller'
import {
  HttpRequest,
  ICreatePositionUseCase,
  ILoadUserByIdUseCase,
  IPositionModel,
  IValidation,
  ok,
  Result,
  serverError,
  forbidden,
  ServerError,
  unprocessableEntity,
  UserRoles,
  IUserModel,
  UnauthorizedError
} from './create-position-protocols'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    positionName: 'any_name'
  },
  userId: 'any_account_id'
})

const makeFakePosition = (): Result<IPositionModel> => {
  return Result.ok({
    id: 'any_id',
    positionName: 'any_name'
  })
}

const makeFakeUser = (): IUserModel => ({
  id: 'any_id',
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

const makeCreatePositionUseCaseStub = (): ICreatePositionUseCase => {
  class CreatePositionUseCaseStub implements ICreatePositionUseCase {
    async create(name: string): Promise<ICreatePositionUseCase.result> {
      return Promise.resolve(
        Result.ok({ positionName: 'any_name', id: 'any_id' })
      )
    }
  }
  return new CreatePositionUseCaseStub()
}

interface SutTypes {
  sut: CreatePositionController
  createPositionUseCaseStub: ICreatePositionUseCase
  loadUserByIdUseCaseStub: ILoadUserByIdUseCase
  validationStub: IValidation
}

const makeSut = (): SutTypes => {
  const createPositionUseCaseStub = makeCreatePositionUseCaseStub()
  const loadUserByIdUseCaseStub = makeLoadUserUseCaseStub()
  const validationStub = makeValidationStub()
  const sut = new CreatePositionController(
    validationStub,
    createPositionUseCaseStub,
    loadUserByIdUseCaseStub
  )
  return {
    sut,
    createPositionUseCaseStub,
    loadUserByIdUseCaseStub,
    validationStub
  }
}

describe('CreatePositionController', () => {
  test('Should call CreatePositionUseCase with correct values', async () => {
    const { sut, createPositionUseCaseStub } = makeSut()
    const useCaseSpy = jest.spyOn(createPositionUseCaseStub, 'create')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(useCaseSpy).toHaveBeenCalledWith('any_name')
  })

  test('Should return 500 if an SignUpUseCase throws', async () => {
    const { sut, createPositionUseCaseStub } = makeSut()
    jest
      .spyOn(createPositionUseCaseStub, 'create')
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 422 if valid data is provided, but it cannot be processed', async () => {
    const { sut, createPositionUseCaseStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest
      .spyOn(createPositionUseCaseStub, 'create')
      .mockReturnValueOnce(Promise.resolve(Result.fail('any_error_message')))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unprocessableEntity('any_error_message'))
  })

  test('Should call LoadUserByIdUseCase with correct values', async () => {
    const { sut, loadUserByIdUseCaseStub: loadUserByEmailUseCaseStub } =
      makeSut()
    const useCaseSpy = jest.spyOn(loadUserByEmailUseCaseStub, 'load')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(useCaseSpy).toHaveBeenCalledWith('any_account_id')
  })

  test('Should return 403 if valid data is provided, but user is not an admin', async () => {
    const { sut, loadUserByIdUseCaseStub: loadUserByEmailUseCaseStub } =
      makeSut()
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

  test('Should return 200 with a PositionModel if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakePosition().getValue()))
  })
})
