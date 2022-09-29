import { Result } from '../../logic/result'

export interface IDeletePositionUseCase {
  delete: (id: string) => Promise<IDeletePositionUseCase.result>
}

export namespace IDeletePositionUseCase {
  export type result = Result<any>
}
