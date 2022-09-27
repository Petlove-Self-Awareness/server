import {
  IUpdateUserUseCase,
  UpdateUserDto
} from '../../../../domain/usecases/user/update-user'
import { HttpRequest, Result } from '../login/login-controller-protocols'
import { IUserModel, UserRoles } from '../signup/signup-controller-protocols'
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
  class UpdateUserUseCase implements IUpdateUserUseCase {
    update(updateUserDto: UpdateUserDto): Promise<Result<IUserModel>> {
      return null
    }
  }
  return new UpdateUserUseCase()
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
  test('Should call IUpdateUserUseCase with correct values', async () => {
    const { sut, userUpdateUseCaseStub } = makeSut()
    const updateSpy = jest.spyOn(userUpdateUseCaseStub, 'update')
    await sut.handle(makeFakeRequest())
    expect(updateSpy).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    })
  })
})
