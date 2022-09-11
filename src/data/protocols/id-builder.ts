export interface IDBuilder {
  createId: () => string
  isUUID: (value: string) => boolean
}
