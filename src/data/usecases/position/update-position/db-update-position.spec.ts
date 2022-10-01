import { DbUpdatePosition } from './db-update-position'
import {
  ILoadPositionByNameRepository,
  ISavePositionRepository,
  IPositionModel,
  Result
} from './db-update-position-protocols'

const makeFakePositionData = (): ISavePositionRepository.Params => ({
  id: 'valid_id',
  positionName: 'another_position_name'
})

interface SutTypes {
  sut: DbUpdatePosition
  loadPositionByNameRepositoryStub: ILoadPositionByNameRepository
  savePositionRepositoryStub: ISavePositionRepository
}

const makeSavePositionRepositoryStub = (): ISavePositionRepository => {
  class SavePositionRepositoryStub implements ISavePositionRepository {
    async save(
      data: ISavePositionRepository.Params
    ): Promise<ISavePositionRepository.Result> {
      return Promise.resolve()
    }
  }
  return new SavePositionRepositoryStub()
}

const makeLoadPositionByNameRepositoryStub = (): ILoadPositionByNameRepository => {
  class LoadPositionByNameRepositoryStub implements ILoadPositionByNameRepository {
    async loadByName(name: string): Promise<IPositionModel> {
      return Promise.resolve(null)
    }
  }
  return new LoadPositionByNameRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadPositionByNameRepositoryStub = makeLoadPositionByNameRepositoryStub()
  const savePositionRepositoryStub = makeSavePositionRepositoryStub()
  const sut = new DbUpdatePosition(
    loadPositionByNameRepositoryStub,
    savePositionRepositoryStub
  )

  return { sut, loadPositionByNameRepositoryStub, savePositionRepositoryStub }
}

describe('DbUpdatePosition', () => {
  test('Should call ILoadPositionByNameRepository with correct value', async () => {
    const { sut, loadPositionByNameRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadPositionByNameRepositoryStub, 'loadByName')
    await sut.update(makeFakePositionData())
    expect(loadSpy).toHaveBeenCalledWith(makeFakePositionData().positionName)
  })

  test('Should return fail if ILoadPositionByNameRepository returns a position', async () => {
    const { sut, loadPositionByNameRepositoryStub } = makeSut()
    jest
      .spyOn(loadPositionByNameRepositoryStub, 'loadByName')
      .mockReturnValueOnce(Promise.resolve(makeFakePositionData()))
    const result = await sut.update(makeFakePositionData())
    expect(result).toEqual(Result.fail('Position name already exists'))
  })

  test('Should throw if ILoadPositionByNameRepository throws', async () => {
    const { sut, loadPositionByNameRepositoryStub } = makeSut()
    jest
      .spyOn(loadPositionByNameRepositoryStub, 'loadByName')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const result = sut.update(makeFakePositionData())
    expect(result).rejects.toThrow()
  })

  test('Should call ISavePositionRepository with correct value', async () => {
    const { sut, savePositionRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(savePositionRepositoryStub, 'save')
    await sut.update(makeFakePositionData())
    expect(saveSpy).toHaveBeenCalledWith(makeFakePositionData())
  })

  test('Should return fail if an invalid id is provided', async () => {
    const { sut, savePositionRepositoryStub } = makeSut()
    jest
      .spyOn(savePositionRepositoryStub, 'save')
      .mockReturnValueOnce(Promise.resolve(null))
    const result = await sut.update(makeFakePositionData())
    expect(result).toEqual(
      Result.fail(`Position with id ${makeFakePositionData().id} was not found`)
    )
  })

  test('Should throw if ISavePositionRepository throws', async () => {
    const { sut, loadPositionByNameRepositoryStub } = makeSut()
    jest
      .spyOn(loadPositionByNameRepositoryStub, 'loadByName')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const result = sut.update(makeFakePositionData())
    expect(result).rejects.toThrow()
  })

  test('Should return a position model on success', async () => {
    const { sut, savePositionRepositoryStub } = makeSut()
    jest.spyOn(savePositionRepositoryStub, 'save').mockReturnValueOnce(Promise.resolve())
    const result = await sut.update(makeFakePositionData())
    expect(result).toEqual(Result.ok(makeFakePositionData()))
  })
})
