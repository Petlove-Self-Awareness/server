import { UpdateUserData } from '../../../domain/usecases/user/update-user'
import { IUpdateUserRepository } from '../../protocols/db/user/update-user-repository'
import { Result } from '../load-user-by-token/db-load-user-by-token-protocols'
import {
  IHasher,
  ILoadUserByEmailOrIdRepository,
  IUserModel,
  UserRoles
} from '../signup/db-signup-protocols'
import { DbUpdateUser } from './db-update-user'

const makeFakeUpdateUserData = (): UpdateUserData => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com'
})

const makeFakeUserExists = (): IUserModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  role: UserRoles.employee
})

const makeLoadUserByEmailOrIdRepository = (): ILoadUserByEmailOrIdRepository => {
  class LoadUserByEmailOrIdRepositoryStub implements ILoadUserByEmailOrIdRepository {
    async loadUserByEmailOrId(value: string): Promise<IUserModel> {
      return Promise.resolve(makeFakeUserExists())
    }
  }
  return new LoadUserByEmailOrIdRepositoryStub()
}

const makeUpdateUserRepositoryStub = (): IUpdateUserRepository => {
  class UpdateUserRepositoryStub implements IUpdateUserRepository {
    async update(updateUserData: UpdateUserData): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateUserRepositoryStub()
}

const makeHasher = (): IHasher => {
  class HasherStub implements IHasher {
    async hash(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

interface SutTypes {
  sut: DbUpdateUser
  hasherStub: IHasher
  loadUserByEmailOrIdRepositoryStub: ILoadUserByEmailOrIdRepository
}

const makeSut = (): SutTypes => {
  const loadUserByEmailOrIdRepositoryStub = makeLoadUserByEmailOrIdRepository()
  const updateUserRepositoryStub = makeUpdateUserRepositoryStub()
  const hasherStub = makeHasher()
  const sut = new DbUpdateUser(
    loadUserByEmailOrIdRepositoryStub,
    hasherStub,
    updateUserRepositoryStub
  )
  return {
    sut,
    loadUserByEmailOrIdRepositoryStub,
    hasherStub
  }
}

describe('DbUpdateUser', () => {
  test('Should call ILoadUserByEmailOrIdRepository with data user id', async () => {
    const { sut, loadUserByEmailOrIdRepositoryStub } = makeSut()
    const loadUserSpy = jest.spyOn(
      loadUserByEmailOrIdRepositoryStub,
      'loadUserByEmailOrId'
    )
    const updateUserData = makeFakeUpdateUserData()
    await sut.update(updateUserData)
    expect(loadUserSpy).toHaveBeenCalledWith(updateUserData.id)
  })

  test('Should return fail if ILoadUserByEmailOrIdRepository returns fail', async () => {
    const { sut, loadUserByEmailOrIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadUserByEmailOrIdRepositoryStub, 'loadUserByEmailOrId')
      .mockReturnValueOnce(null)

    const response = await sut.update(makeFakeUpdateUserData())
    expect(response).toEqual(Result.fail<IUserModel>('Invalid user id'))
  })

  test('Should throw if LoadUserByEmailOrIdRepository throws', async () => {
    const { sut, loadUserByEmailOrIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadUserByEmailOrIdRepositoryStub, 'loadUserByEmailOrId')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.update(makeFakeUpdateUserData())
    await expect(promise).rejects.toThrow()
  })
})
