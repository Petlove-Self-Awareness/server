import { DbAuthentication } from '../../../../../data/usecases/login/db-login'
import { ILogin } from '../../../../../domain/usecases/login'
import { JwtAdapter } from '../../../../../infra/criptography/jwt/jwt-adapter'
import { BcryptAdapter } from '../../../../../infra/criptography/bcrypt/bcrypt-adapter'
import { UUIDAdapter } from '../../../../../infra/criptography/uuid/uuid-adapter'
import { UserPostgresRepository } from '../../../../../infra/db/postgres/user-postgres-repository'
import { prisma } from '../../prisma-helper'

export const makeDbLogin = (): ILogin => {
  const uuidAdapter = new UUIDAdapter()
  const userPostgresRepository = new UserPostgresRepository(uuidAdapter, prisma)
  const jwtAdapter = new JwtAdapter()
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  return new DbAuthentication(userPostgresRepository, bcryptAdapter, jwtAdapter)
}
