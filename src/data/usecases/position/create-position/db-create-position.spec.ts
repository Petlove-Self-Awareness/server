import { IPositionModel } from '../../../../domain/models/position'
import {
  ICreatePositionRepository,
  ILoadPositionByNameRepository,
  IDBuilder,
  Result
} from './db-create-position-protocols'
import { DbCreatePositionUseCase } from './db-create-position'

const makeFakePosition = (): ILoadPositionByNameRepository.Result => ({
  id: 'valid_id',
  positionName: 'any_position'
})

const makeFakePositionData = (): ICreatePositionRepository.Params => ({
  id: 'valid_id',
  positionName: 'any_position'
})

const makeIdBuilder = (): IDBuilder => {
  class IdBuilderStub implements IDBuilder {
    createId(): string {
      return 'valid_id'
    }
  }
  return new IdBuilderStub()
}

const makeCreatePositionRepositoryStub = (): ICreatePositionRepository => {
  class CreatePositionRepositoryStub implements ICreatePositionRepository {
    async create(
      positionData: ICreatePositionRepository.Params
    ): Promise<void> {
      return Promise.resolve()
    }
  }
  return new CreatePositionRepositoryStub()
}

const makeLoadPositionByNameRepositoryStub =
  (): ILoadPositionByNameRepository => {
    class LoadPositionByNameRepositoryStub
      implements ILoadPositionByNameRepository
    {
      async loadByName(name: string): Promise<IPositionModel> {
        return Promise.resolve(null)
      }
    }
    return new LoadPositionByNameRepositoryStub()
  }

interface ISutTypes {
  sut: DbCreatePositionUseCase
  idBuilderStub: IDBuilder
  createPositionRepositoryStub: ICreatePositionRepository
  loadPositionByNameRepositoryStub: ILoadPositionByNameRepository
}

const makeSut = (): ISutTypes => {
  const createPositionRepositoryStub = makeCreatePositionRepositoryStub()
  const loadPositionByNameRepositoryStub =
    makeLoadPositionByNameRepositoryStub()
  const idBuilderStub = makeIdBuilder()
  const sut = new DbCreatePositionUseCase(
    idBuilderStub,
    loadPositionByNameRepositoryStub,
    createPositionRepositoryStub
  )
  return {
    sut,
    idBuilderStub,
    createPositionRepositoryStub,
    loadPositionByNameRepositoryStub
  }
}

describe('DbCreatePositionUseCase', () => {
  test('Should call IdBuilder', async () => {
    const { sut, idBuilderStub } = makeSut()
    const idBuilderSpy = jest.spyOn(idBuilderStub, 'createId')
    await sut.create(makeFakePositionData().positionName)
    expect(idBuilderSpy).toHaveBeenCalled()
  })

  test('Should call LoadPositionByNameRepository with correct values', async () => {
    const { sut, loadPositionByNameRepositoryStub } = makeSut()
    const loadUserSpy = jest.spyOn(loadPositionByNameRepositoryStub, 'loadByName')
    await sut.create(makeFakePositionData().positionName)
    expect(loadUserSpy).toHaveBeenCalledWith(
      makeFakePositionData().positionName
    )
  })

  test('Should throw if LoadPositionByNameRepository throws', async () => {
    const { sut, loadPositionByNameRepositoryStub } = makeSut()
    jest
      .spyOn(loadPositionByNameRepositoryStub, 'loadByName')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.create(makeFakePositionData().positionName)
    await expect(promise).rejects.toThrow()
  })

  test('Should return fail if LoadPositionByNameRepository finds a position', async () => {
    const { sut, loadPositionByNameRepositoryStub } = makeSut()
    jest
      .spyOn(loadPositionByNameRepositoryStub, 'loadByName')
      .mockReturnValueOnce(Promise.resolve(makeFakePosition()))
    const user = await sut.create(makeFakePositionData().positionName)
    expect(user).toEqual(Result.fail('Position already exists'))
  })

  test('Should call CreatePositionRepository with correct values', async () => {
    const { sut, createPositionRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(createPositionRepositoryStub, 'create')
    await sut.create(makeFakePositionData().positionName)
    expect(addSpy).toHaveBeenCalledWith(makeFakePositionData())
  })

  test('Should throw if CreatePositionRepository throws', async () => {
    const { sut, createPositionRepositoryStub } = makeSut()
    jest
      .spyOn(createPositionRepositoryStub, 'create')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.create(makeFakePositionData().positionName)
    await expect(promise).rejects.toThrow()
  })

  test('Should return successfull result on success', async () => {
    const { sut } = makeSut()
    const account = await sut.create(makeFakePositionData().positionName)
    expect(account).toEqual(Result.ok(makeFakePosition()))
  })
})
