import { v4 as uuidv4 } from 'uuid'
import { IDBuilder } from '../data/protocols/id-builder'

export class UUIDBuilder implements IDBuilder {
  createId(): string {
    return uuidv4()
  }
}
