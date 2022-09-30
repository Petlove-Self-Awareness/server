import { DbLoadUserByToken } from '../../../../data/usecases/user/load-user-by-token/db-load-user-by-token'
import { ILoadUserByToken } from '../../../../domain/usecases/user/load-user-by-token'
import { JwtAdapter } from '../../../../infra/criptography/jwt/jwt-adapter'
import { UUIDAdapter } from '../../../../infra/criptography/uuid/uuid-adapter'
import { PrismaHelper } from '../../../../infra/db/helpers/prisma-helper'
import { UserPostgresRepository } from '../../../../infra/db/postgres/user-postgres-repository'

export const makeDbLoadUserByToken = (): ILoadUserByToken => {
  const jwtAdapter = new JwtAdapter()
  const uuidAdapter = new UUIDAdapter()
  const userPostgresRepository = new UserPostgresRepository(
    uuidAdapter,
    PrismaHelper.client
  )
  return new DbLoadUserByToken(jwtAdapter, userPostgresRepository)
}
