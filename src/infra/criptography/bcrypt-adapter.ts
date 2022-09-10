import * as bcrypt from 'bcryptjs'
import { IEncrypter } from '../../data/protocols/encrypter'

export class BcryptAdapter implements IEncrypter {
  private salt: number
  constructor(salt: number) {
    this.salt = salt
  }
  async encrypt(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt)
  }
}
