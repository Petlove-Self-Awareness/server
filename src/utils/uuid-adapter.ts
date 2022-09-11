import { v4 as uuidv4, validate as uuidValidate } from 'uuid'
import { IDBuilder } from '../data/protocols/id-builder'

export class UUIDBuilder implements IDBuilder {
  createId(): string {
    return uuidv4()
  }

  isUUID(value: string): boolean {
    return uuidValidate(value)
  }
}
