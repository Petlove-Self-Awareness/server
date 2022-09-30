import { DbAuthentication } from '../../../../data/usecases/user/login/db-login'
import { ILogin } from '../../../../domain/usecases/user/login'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/criptography/jwt/jwt-adapter'
import { UUIDAdapter } from '../../../../infra/criptography/uuid/uuid-adapter'
import { PrismaHelper } from '../../../../infra/db/helpers/prisma-helper'
import { UserPostgresRepository } from '../../../../infra/db/postgres/user-postgres-repository'

export const makeDbLogin = (): ILogin => {
  const uuidAdapter = new UUIDAdapter()
  const userPostgresRepository = new UserPostgresRepository(uuidAdapter, PrismaHelper.client)
  const jwtAdapter = new JwtAdapter()
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  return new DbAuthentication(userPostgresRepository, bcryptAdapter, jwtAdapter)
}
