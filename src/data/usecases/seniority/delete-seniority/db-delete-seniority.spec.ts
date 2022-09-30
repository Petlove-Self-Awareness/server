import { DbDeleteSeniority } from './db-delete-seniority'
import {
  IDeleteSeniorityRepository,
  Result
} from './db-delete-seniority-protocols'

const makeFakeId = (): string => 'valid_id'

const makeDeletePositionByIdRepoStub = (): IDeleteSeniorityRepository => {
  class DeleteSeniorityByIdRepositoryStub implements IDeleteSeniorityRepository {
    async delete(id: string): Promise<IDeleteSeniorityRepository.Result> {
      return Promise.resolve()
    }
  }
  return new DeleteSeniorityByIdRepositoryStub()
}

type SutTypes = {
  deleteRepositoryByIdRepositoryStub: IDeleteSeniorityRepository
  sut: DbDeleteSeniority
}

const makeSut = (): SutTypes => {
  const deleteRepositoryByIdRepositoryStub = makeDeletePositionByIdRepoStub()
  const sut = new DbDeleteSeniority(deleteRepositoryByIdRepositoryStub)
  return { sut, deleteRepositoryByIdRepositoryStub }
}

describe('DbDeleteSeniority', () => {
  test('Should call IDeleteSeniorityRepository with correct values', async () => {
    const { deleteRepositoryByIdRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(deleteRepositoryByIdRepositoryStub, 'delete')
    await sut.delete(makeFakeId())
    expect(loadSpy).toHaveBeenCalledWith('valid_id')
  })

  test('Should return fail if IDeleteSeniorityRepository returns null', async () => {
    const {
      deleteRepositoryByIdRepositoryStub,
      sut
    } = makeSut()
    jest
      .spyOn(deleteRepositoryByIdRepositoryStub, 'delete')
      .mockReturnValueOnce(Promise.resolve(null))
    const result = await sut.delete(makeFakeId())
    expect(result).toEqual(Result.fail('No seniority register was found'))
  })

  test('Should return an ok result on success', async () => {
    const { sut } = makeSut()
    const account = await sut.delete(makeFakeId())
    expect(account).toEqual(Result.ok('Seniority successfully deleted'))
  })

  test('Should throw if IDeleteSeniorityRepository throws', async () => {
    const { deleteRepositoryByIdRepositoryStub, sut } = makeSut()
    jest
      .spyOn(deleteRepositoryByIdRepositoryStub, 'delete')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.delete(makeFakeId())
    await expect(promise).rejects.toThrow()
  })
})
