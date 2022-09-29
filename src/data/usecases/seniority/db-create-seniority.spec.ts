import {
  ICreateSeniorityRepository,
  ILoadSeniorityByNameRepository,
  Result,
  IDBuilder
} from './db-create-seniority-protocols'
import { DbCreateSeniorityUseCase } from './db-create-seniority'

const makeFakeSeniority = (): ILoadSeniorityByNameRepository.Result => ({
  id: 'valid_id',
  seniorityName: 'any_seniority'
})

const makeIdBuilder = (): IDBuilder => {
  class IdBuilderStub implements IDBuilder {
    createId(): string {
      return 'valid_id'
    }
  }
  return new IdBuilderStub()
}

const makeCreateSeniorityRepositoryStub = (): ICreateSeniorityRepository => {
  class CreatePositionRepositoryStub implements ICreateSeniorityRepository {
    async create(data: ICreateSeniorityRepository.Params): Promise<void> {
      return Promise.resolve()
    }
  }
  return new CreatePositionRepositoryStub()
}

const makeLoadSeniorityByNameRepositoryStub =
  (): ILoadSeniorityByNameRepository => {
    class LoadPositionByNameRepositoryStub
      implements ILoadSeniorityByNameRepository
    {
      async loadByName(
        name: string
      ): Promise<ILoadSeniorityByNameRepository.Result> {
        return Promise.resolve(null)
      }
    }
    return new LoadPositionByNameRepositoryStub()
  }

interface ISutTypes {
  sut: DbCreateSeniorityUseCase
  idBuilderStub: IDBuilder
  createSeniorityRepositoryStub: ICreateSeniorityRepository
  loadSeniorityByNameRepositoryStub: ILoadSeniorityByNameRepository
}

const makeSut = (): ISutTypes => {
  const createSeniorityRepositoryStub = makeCreateSeniorityRepositoryStub()
  const loadSeniorityByNameRepositoryStub =
    makeLoadSeniorityByNameRepositoryStub()
  const idBuilderStub = makeIdBuilder()
  const sut = new DbCreateSeniorityUseCase(
    idBuilderStub,
    loadSeniorityByNameRepositoryStub,
    createSeniorityRepositoryStub
  )
  return {
    sut,
    idBuilderStub,
    createSeniorityRepositoryStub,
    loadSeniorityByNameRepositoryStub
  }
}

describe('DbCreateSeniorityUseCase', () => {
  test('Should call IdBuilder', async () => {
    const { sut, idBuilderStub } = makeSut()
    const idBuilderSpy = jest.spyOn(idBuilderStub, 'createId')
    await sut.create(makeFakeSeniority().seniorityName)
    expect(idBuilderSpy).toHaveBeenCalled()
  })

  test('Should call ILoadSeniorityByNameRepository with correct values', async () => {
    const { sut, loadSeniorityByNameRepositoryStub } = makeSut()
    const loadUserSpy = jest.spyOn(
      loadSeniorityByNameRepositoryStub,
      'loadByName'
    )
    await sut.create(makeFakeSeniority().seniorityName)
    expect(loadUserSpy).toHaveBeenCalledWith(makeFakeSeniority().seniorityName)
  })

  test('Should throw if ILoadSeniorityByNameRepository throws', async () => {
    const {
      sut,
      loadSeniorityByNameRepositoryStub: loadPositionByNameRepositoryStub
    } = makeSut()
    jest
      .spyOn(loadPositionByNameRepositoryStub, 'loadByName')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.create(makeFakeSeniority().seniorityName)
    await expect(promise).rejects.toThrow()
  })

  test('Should return fail if ILoadSeniorityByNameRepository finds a position', async () => {
    const {
      sut,
      loadSeniorityByNameRepositoryStub: loadPositionByNameRepositoryStub
    } = makeSut()
    jest
      .spyOn(loadPositionByNameRepositoryStub, 'loadByName')
      .mockReturnValueOnce(Promise.resolve(makeFakeSeniority()))
    const user = await sut.create(makeFakeSeniority().seniorityName)
    expect(user).toEqual(Result.fail('Seniority already exists'))
  })

  test('Should call ICreateSeniorityRepository with correct values', async () => {
    const { sut, createSeniorityRepositoryStub: createPositionRepositoryStub } =
      makeSut()
    const addSpy = jest.spyOn(createPositionRepositoryStub, 'create')
    await sut.create(makeFakeSeniority().seniorityName)
    expect(addSpy).toHaveBeenCalledWith(makeFakeSeniority())
  })

  test('Should throw if ICreateSeniorityRepository throws', async () => {
    const { sut, createSeniorityRepositoryStub: createPositionRepositoryStub } =
      makeSut()
    jest
      .spyOn(createPositionRepositoryStub, 'create')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.create(makeFakeSeniority().seniorityName)
    await expect(promise).rejects.toThrow()
  })

  test('Should return successfull result on success', async () => {
    const { sut } = makeSut()
    const account = await sut.create(makeFakeSeniority().seniorityName)
    expect(account).toEqual(Result.ok(makeFakeSeniority()))
  })
})
