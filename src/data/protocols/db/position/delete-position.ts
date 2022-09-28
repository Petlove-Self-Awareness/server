export interface IDeletePositionRepository {
  delete: (id: string) => Promise<IDeletePositionRepository.Result>
}

export namespace IDeletePositionRepository {
  export type Result = void
}
