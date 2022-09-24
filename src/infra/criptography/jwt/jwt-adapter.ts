import jwt from 'jsonwebtoken'
import { IEncrypter } from '../../../data/protocols/criptography'
import { IDecrypter } from '../../../data/protocols/criptography/decrypter'
import env from '../../../main/config/env'

export class JwtAdapter implements IEncrypter, IDecrypter {
  encrypt(id: string): string {
    const token = jwt.sign({ id }, env.jwtSecret, {
      expiresIn: '12h'
    })
    return token
  }

  decrypt(value: string): string {
    const decoded: any = jwt.verify(value, env.jwtSecret)
    return decoded.id
  }
}
