import {
  IUpdateUserUseCase,
  UpdateUserDto
} from '../../../domain/usecases/user/update-user'
import { Result } from '../load-user-by-token/db-load-user-by-token-protocols'
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

  test('Must call addChange if it succeeds in creating a UserName', () => {
    
  })
})
