import { IEncrypter } from '../../../data/protocols/criptography'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements IEncrypter {
  async encrypt(id: string): Promise<string> {
    return jwt.sign(id, process.env.JWT_SECRET || 'petloveServerPass')
  }
}
