import { v4 as uuidv4, validate as uuidValidate } from 'uuid'
import { IDBuilder } from '../../../data/protocols/criptography/id-builder'
import { IUUIDValidator } from '../../../data/protocols/criptography/id-validator'

export class UUIDAdapter implements IDBuilder, IUUIDValidator {
  createId(): string {
    return uuidv4()
  }

  isUUID(value: string): boolean {
    return uuidValidate(value)
  }
}
