import { Result } from '../../logic/result'

export interface IDeleteSeniorityUseCase {
  delete: (id: string) => Promise<IDeleteSeniorityUseCase.result>
}

export namespace IDeleteSeniorityUseCase {
  export type result = Result<any>
}
