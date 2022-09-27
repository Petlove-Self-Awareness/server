import {
  IUpdateUserUseCase,
  UpdateUserDto
} from '../../../../domain/usecases/user/update-user'
import {
  badRequest,
  HttpRequest,
  MissingParamError,
  Result
} from '../login/login-controller-protocols'
import { IUserModel } from '../signup/signup-controller-protocols'
import { UpdateUserController } from './update-user-controller'

const makeFakeRequest = (): HttpRequest => ({
  accountId: 'any_id',
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

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
        password: '1234'
      }
    })
    expect(error).toEqual(
      badRequest(new MissingParamError('password confirmation not informed'))
    )
  })

  test('Should call IUpdateUserUseCase with correct values', async () => {
    const { sut, userUpdateUseCaseStub } = makeSut()
    const updateSpy = jest.spyOn(userUpdateUseCaseStub, 'update')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    const dataToUpdate = Object.assign(httpRequest.body, {
      id: httpRequest.accountId
    })
    console.log(dataToUpdate)
    expect(updateSpy).toHaveBeenCalledWith(dataToUpdate)
  })
})
