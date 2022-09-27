import { ILoadPositionById } from './db-load-position-by-id-protocols'

export class DbLoadPositionById implements ILoadPositionById {
  load: (id: string) => Promise<ILoadPositionById.Result>
}
