export interface IDeletePositionRepository {
  delete: (id: string) => Promise<void>
}
