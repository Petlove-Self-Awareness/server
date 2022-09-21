import * as bcrypt from 'bcryptjs'
import { IHashComparer } from '../../../data/protocols/criptography'
import { IHasher } from '../../../data/protocols/criptography/hasher'

export class BcryptAdapter implements IHasher, IHashComparer {
  private salt: number
  constructor(salt: number) {
    this.salt = salt
  }
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt)
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    const compare = await bcrypt.compare(value, hashedValue)
    return compare
  }
}
