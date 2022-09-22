import { IEncrypter } from '../../../data/protocols/criptography'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements IEncrypter {
  encrypt(id: string): string {
    const token = jwt.sign(
      { id },
      process.env.JWT_SECRET || 'petloveServerPass',
      {
        expiresIn: '12h'
      }
    )
    return token
  }
}
