export interface IDeleteSeniorityRepository {
  delete: (id: string) => Promise<IDeleteSeniorityRepository.Result>
}

export namespace IDeleteSeniorityRepository {
  export type Result = void
}
