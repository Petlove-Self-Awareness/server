import { SignupController } from './signup-controller'
import {
  created,
  HttpRequest,
  ISingupUseCase,
  IUserModel,
  IValidation,
  Result,
  serverError,
  SignupData,
  unprocessableEntity,
  ServerError
} from './signup-controller-protocols'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeUser = (): Result<IUserModel> => {
  return Result.ok({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })
}

const makeValidationStub = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeSignUpUseCaseStub = (): ISingupUseCase => {
  class SignUpUseCaseStub implements ISingupUseCase {
    signUp(signupData: SignupData): Promise<Result<IUserModel>> {
      return new Promise(resolve => resolve(makeFakeUser()))
    }
  }
  return new SignUpUseCaseStub()
}

interface SutTypes {
  sut: SignupController
  signUpUseCaseStub: ISingupUseCase
  validationStub: IValidation
}

const makeSut = (): SutTypes => {
  const signUpUseCaseStub = makeSignUpUseCaseStub()
  const validationStub = makeValidationStub()
  const sut = new SignupController(signUpUseCaseStub, validationStub)
  return { sut, signUpUseCaseStub, validationStub }
}

describe('SignUpController', () => {
  test('Should call SignUpUseCase with correct values', async () => {
    const { sut, signUpUseCaseStub } = makeSut()
    const addSpy = jest.spyOn(signUpUseCaseStub, 'signUp')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if an SignUpUseCase throws', async () => {
    const { sut, signUpUseCaseStub } = makeSut()
    jest.spyOn(signUpUseCaseStub, 'signUp').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(created(makeFakeUser().getValue()))
  })

  test('Should return 422 if valid data is provided, but it cannot be processed', async () => {
    const { sut, signUpUseCaseStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest
      .spyOn(signUpUseCaseStub, 'signUp')
      .mockReturnValueOnce(
        new Promise(resolve => resolve(Result.fail('any_error_message')))
      )
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unprocessableEntity('any_error_message'))
  })
})
