import { DbSignUp } from '../../../../../data/usecases/signup/db-signup'
import { ISingupUseCase } from '../../../../../domain/usecases/signup'
import { BcryptAdapter } from '../../../../../infra/criptography/bcrypt/bcrypt-adapter'
import { UUIDAdapter } from '../../../../../infra/criptography/uuid/uuid-adapter'
import { PrismaHelper } from '../../../../../infra/db/helpers/prisma-helper'
import { UserPostgresRepository } from '../../../../../infra/db/postgres/user-postgres-repository'

export const makeDbSignUp = (): ISingupUseCase => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const uuidAdapter = new UUIDAdapter()
  const userPostgresRepository = new UserPostgresRepository(
    uuidAdapter,
    PrismaHelper.client
  )
  return new DbSignUp(
    bcryptAdapter,
    uuidAdapter,
    userPostgresRepository,
    userPostgresRepository
  )
}
