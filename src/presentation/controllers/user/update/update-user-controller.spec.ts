import {
  IUpdateUserUseCase,
  UpdateUserData
} from '../../../../domain/usecases/user/update-user'
import {
  badRequest,
  HttpRequest,
  InvalidParamError,
  MissingParamError,
  ok,
  Result,
  ServerError,
  serverError
} from '../login/login-controller-protocols'
import { IUserModel, UserRoles } from '../signup/signup-controller-protocols'
import { UpdateUserController } from './update-user-controller'

const makeFakeRequest = (): HttpRequest => ({
  userId: 'any_id',
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
    password: 'any_password',
    role: UserRoles.employee
  })
}

const makeUserUpdateUseCaseStub = (): IUpdateUserUseCase => {
  class UpdateUserUseCaseStub implements IUpdateUserUseCase {
    update(updateUserData: UpdateUserData): Promise<Result<IUserModel>> {
      return Promise.resolve(makeFakeUser())
    }
  }
  return new UpdateUserUseCaseStub()
}

interface ISutTypes {
  sut: UpdateUserController
  userUpdateUseCaseStub: IUpdateUserUseCase
}
const makeSut = (): ISutTypes => {
  const userUpdateUseCaseStub = makeUserUpdateUseCaseStub()
  const sut = new UpdateUserController(userUpdateUseCaseStub)
  return {
    sut,
    userUpdateUseCaseStub
  }
}

describe('UpdateUser Controller', () => {
  test('Should return an error if no field is provided for update', async () => {
    const { sut } = makeSut()
    const error = await sut.handle({ body: {} })
    expect(error).toEqual(
      badRequest(new MissingParamError('name, email or password not informed'))
    )
  })

  test('Should return an error if password is informed and passwordConfirmation is not provided', async () => {
    const { sut } = makeSut()
    const error = await sut.handle({
      body: {
        password: 'any_password'
      }
    })
    expect(error).toEqual(
      badRequest(new MissingParamError('password confirmation not informed'))
    )
  })

  test('Should return an error if the password is different from the password confirmation ', async () => {
    const { sut } = makeSut()
    const error = await sut.handle({
      body: {
        password: 'any_password',
        passwordConfirmation: 'password_confirmation_different'
      }
    })
    expect(error).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('Should call IUpdateUserUseCase with correct values', async () => {
    const { sut, userUpdateUseCaseStub } = makeSut()
    const updateSpy = jest.spyOn(userUpdateUseCaseStub, 'update')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    const dataToUpdate = Object.assign(httpRequest.body, {
      id: httpRequest.userId
    })
    expect(updateSpy).toHaveBeenCalledWith(dataToUpdate)
  })

  test('Should return 500 if UserUpdateUseCase throws', async () => {
    const { sut, userUpdateUseCaseStub } = makeSut()
    jest.spyOn(userUpdateUseCaseStub, 'update').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 if UpdateUserController success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    const fakeUser = makeFakeUser()
    expect(httpResponse).toEqual(ok(fakeUser.getValue()))
  })
})
