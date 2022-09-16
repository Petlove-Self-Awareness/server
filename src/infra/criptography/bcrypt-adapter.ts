import * as bcrypt from 'bcryptjs'
import { IHasher } from '../../data/protocols/criptography/hasher'

export class BcryptAdapter implements IHasher {
  private salt: number
  constructor(salt: number) {
    this.salt = salt
  }
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt)
  }
}
