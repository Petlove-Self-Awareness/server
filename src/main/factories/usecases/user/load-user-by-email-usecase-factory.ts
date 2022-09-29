import { DbLoadUserByEmail } from '../../../../data/usecases/user/load-user-by-id/db-load-user-by-id'
import { UUIDAdapter } from '../../../../infra/criptography/uuid/uuid-adapter'
import { PrismaHelper } from '../../../../infra/db/helpers/prisma-helper'
import { UserPostgresRepository } from '../../../../infra/db/postgres/user-postgres-repository'

export const makeDbLoadUserByEmail = (): DbLoadUserByEmail => {
  const uuidAdapter = new UUIDAdapter()
  const userPostgresRepository = new UserPostgresRepository(
    uuidAdapter,
    PrismaHelper.client
  )
  return new DbLoadUserByEmail(userPostgresRepository)
}
