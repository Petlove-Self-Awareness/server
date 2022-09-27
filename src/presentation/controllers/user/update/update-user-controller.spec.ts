import {
  IUpdateUserUseCase,
  UpdateUserDto
} from '../../../../domain/usecases/user/update-user'
import {
  HttpRequest,
  IValidation,
  Result
} from '../login/login-controller-protocols'
import { IUserModel, UserRoles } from '../signup/signup-controller-protocols'
import { UpdateUserController } from './update-user-controller'

const makeFakeRequest = (): HttpRequest => ({
  accountId: 'any_id',
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeFakeUser = (): Result<IUserModel> => {
  return Result.ok({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    role: UserRoles.employee
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

const makeUserUpdateUseCaseStub = (): IUpdateUserUseCase => {
  class UpdateUserUseCaseStub implements IUpdateUserUseCase {
    update(updateUserDto: UpdateUserDto): Promise<Result<IUserModel>> {
      return null
    }
  }
  return new UpdateUserUseCaseStub()
}

interface ISutTypes {
  sut: UpdateUserController
  validationStub: IValidation
  userUpdateUseCaseStub: IUpdateUserUseCase
}
const makeSut = (): ISutTypes => {
  const userUpdateUseCaseStub = makeUserUpdateUseCaseStub()
  const validationStub = makeValidationStub()
  const sut = new UpdateUserController(validationStub, userUpdateUseCaseStub)
  return {
    sut,
    validationStub,
    userUpdateUseCaseStub
  }
}

describe('UpdateUser Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should call IUpdateUserUseCase with correct values', async () => {
    const { sut, userUpdateUseCaseStub } = makeSut()
    const updateSpy = jest.spyOn(userUpdateUseCaseStub, 'update')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    const dataToUpdate = Object.assign(httpRequest.body, {
      id: httpRequest.accountId
    })
    expect(updateSpy).toHaveBeenCalledWith(dataToUpdate)
  })
})
