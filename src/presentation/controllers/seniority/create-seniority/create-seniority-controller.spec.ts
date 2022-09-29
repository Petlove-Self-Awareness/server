import { CreateSeniorityController } from './create-seniority-controller'
import {
  HttpRequest,
  ICreateSeniorityUseCase,
  ILoadUserByIdUseCase,
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
} from './create-seniority-protocols'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    seniorityName: 'any_name'
  },
  userId: 'any_account_id'
})

const makeFakeSeniority = (): ICreateSeniorityUseCase.result => {
  return Result.ok({
    id: 'any_id',
    seniorityName: 'any_name'
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

const makeCreateSeniorityUseCaseStub = (): ICreateSeniorityUseCase => {
  class CreateSeniorityUseCaseStub implements ICreateSeniorityUseCase {
    async create(name: string): Promise<ICreateSeniorityUseCase.result> {
      return Promise.resolve(
        Result.ok({ seniorityName: 'any_name', id: 'any_id' })
      )
    }
  }
  return new CreateSeniorityUseCaseStub()
}

interface SutTypes {
  sut: CreateSeniorityController
  createSeniorityUseCaseStub: ICreateSeniorityUseCase
  loadUserByIdUseCaseStub: ILoadUserByIdUseCase
  validationStub: IValidation
}

const makeSut = (): SutTypes => {
  const createSeniorityUseCaseStub = makeCreateSeniorityUseCaseStub()
  const loadUserByIdUseCaseStub = makeLoadUserUseCaseStub()
  const validationStub = makeValidationStub()
  const sut = new CreateSeniorityController(
    validationStub,
    createSeniorityUseCaseStub,
    loadUserByIdUseCaseStub
  )
  return {
    sut,
    createSeniorityUseCaseStub,
    loadUserByIdUseCaseStub,
    validationStub
  }
}

describe('CreateSeniorityController', () => {
  test('Should call ICreateSeniorityUseCase with correct values', async () => {
    const { sut, createSeniorityUseCaseStub } = makeSut()
    const useCaseSpy = jest.spyOn(createSeniorityUseCaseStub, 'create')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(useCaseSpy).toHaveBeenCalledWith('any_name')
  })

  test('Should return 500 if an ICreateSeniorityUseCase throws', async () => {
    const { sut, createSeniorityUseCaseStub } = makeSut()
    jest
      .spyOn(createSeniorityUseCaseStub, 'create')
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 422 if valid data is provided, but it cannot be processed', async () => {
    const { sut, createSeniorityUseCaseStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest
      .spyOn(createSeniorityUseCaseStub, 'create')
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

  test('Should return 200 with a SeniorityModel if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeSeniority().getValue()))
  })
})
