import { UpdateUserDto } from '../../../domain/usecases/user/update-user'
import { IUpdateUserRepository } from '../../protocols/db/user/update-user-repository'
import { Result } from '../load-user-by-token/db-load-user-by-token-protocols'
import {
  ILoadUserByEmailOrIdRepository,
  IUserModel,
  UserRoles
} from '../signup/db-signup-protocols'
import { DbUpdateUser } from './db-update-user'

const makeFakeUpdateUserDto = (): UpdateUserDto => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'Any_password123@'
})

const makeLoadUserByEmailOrIdRepository = (): ILoadUserByEmailOrIdRepository => {
  class LoadUserByEmailOrIdRepositoryStub implements ILoadUserByEmailOrIdRepository {
    async loadUserByEmailOrId(value: string): Promise<IUserModel> {
      return Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'Any_password123',
        role: UserRoles.employee
      })
    }
  }
  return new LoadUserByEmailOrIdRepositoryStub()
}

const makeUpdateUserRepositoryStub = (): IUpdateUserRepository => {
  class UpdateUserRepositoryStub implements IUpdateUserRepository {
    async update(updateUserDto: UpdateUserDto): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateUserRepositoryStub()
}

interface SutTypes {
  sut: DbUpdateUser
  loadUserByEmailOrIdRepositoryStub: ILoadUserByEmailOrIdRepository
}

const makeSut = (): SutTypes => {
  const loadUserByEmailOrIdRepositoryStub = makeLoadUserByEmailOrIdRepository()
  const updateUserRepositoryStub = makeUpdateUserRepositoryStub()
  const sut = new DbUpdateUser(
    loadUserByEmailOrIdRepositoryStub,
    updateUserRepositoryStub
  )
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

  test('Should return fail if ILoadUserByEmailOrIdRepository returns fail', async () => {
    const { sut, loadUserByEmailOrIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadUserByEmailOrIdRepositoryStub, 'loadUserByEmailOrId')
      .mockReturnValueOnce(null)

    const response = await sut.update(makeFakeUpdateUserDto())
    expect(response).toEqual(Result.fail<IUserModel>('Invalid user id'))
  })

  test('Should throw if LoadUserByEmailOrIdRepository throws', async () => {
    const { sut, loadUserByEmailOrIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadUserByEmailOrIdRepositoryStub, 'loadUserByEmailOrId')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.update(makeFakeUpdateUserDto())
    await expect(promise).rejects.toThrow()
  })
})
