import {
  IUpdateUserUseCase,
  UpdateUserDto
} from '../../../domain/usecases/user/update-user'
import {
  ILoadUserByEmailOrIdRepository,
  IUserModel,
  UserRoles
} from '../signup/db-signup-protocols'
import { DbUpdateUser } from './db-update-user'

const makeFakeUpdateUserDto = (): UpdateUserDto => ({
  id: 'any_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeLoadUserByEmailOrIdRepository = (): ILoadUserByEmailOrIdRepository => {
  class LoadUserByEmailOrIdRepositoryStub implements ILoadUserByEmailOrIdRepository {
    async loadUserByEmailOrId(value: string): Promise<IUserModel> {
      return Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        role: UserRoles.employee
      })
    }
  }
  return new LoadUserByEmailOrIdRepositoryStub()
}

interface SutTypes {
  sut: IUpdateUserUseCase
  loadUserByEmailOrIdRepositoryStub: ILoadUserByEmailOrIdRepository
}

const makeSut = (): SutTypes => {
  const loadUserByEmailOrIdRepositoryStub = makeLoadUserByEmailOrIdRepository()
  const sut = new DbUpdateUser(loadUserByEmailOrIdRepositoryStub)
  return {
    sut,
    loadUserByEmailOrIdRepositoryStub
  }
}

describe('DbUpdateUser', () => {
  test('Should call ILoadUserByEmailOrIdRepository with dto user id', async () => {
    const { sut, loadUserByEmailOrIdRepositoryStub } = makeSut()
    const loadUserSpy = jest.spyOn(
      loadUserByEmailOrIdRepositoryStub,
      'loadUserByEmailOrId'
    )
    const updateUserDto = makeFakeUpdateUserDto()
    await sut.update(updateUserDto)
    expect(loadUserSpy).toHaveBeenCalledWith(updateUserDto.id)
  })
})
