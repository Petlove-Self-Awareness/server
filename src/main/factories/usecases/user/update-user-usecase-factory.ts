import { DbUpdateUser } from '../../../../data/usecases/user/update-user/db-update-user'
import { IUpdateUserUseCase } from '../../../../domain/usecases/user/update-user'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt/bcrypt-adapter'
import { UUIDAdapter } from '../../../../infra/criptography/uuid/uuid-adapter'
import { PrismaHelper } from '../../../../infra/db/helpers/prisma-helper'
import { UserPostgresRepository } from '../../../../infra/db/postgres/user-postgres-repository'

export const makeDbUpdateUser = (): IUpdateUserUseCase => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const uuidAdapter = new UUIDAdapter()
  const userPostgresRepository = new UserPostgresRepository(
    uuidAdapter,
    PrismaHelper.client
  )
  return new DbUpdateUser(userPostgresRepository, bcryptAdapter, userPostgresRepository)
}
