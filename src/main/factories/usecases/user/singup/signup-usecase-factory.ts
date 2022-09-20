import { DbSignUp } from '../../../../../data/usecases/signup/db-signup'
import { ISingupUseCase } from '../../../../../domain/usecases/signup'
import { BcryptAdapter } from '../../../../../infra/criptography/bcrypt/bcrypt-adapter'
import { UserPostgresRepository } from '../../../../../infra/db/postgres/user-postgres-repository'
import { UUIDAdapter } from '../../../../../infra/criptography/uuid/uuid-adapter'

export const makeDbSignUp = (): ISingupUseCase => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const uuidAdapter = new UUIDAdapter()
  const userPostgresRepository = new UserPostgresRepository(uuidAdapter)
  return new DbSignUp(
    bcryptAdapter,
    uuidAdapter,
    userPostgresRepository,
    userPostgresRepository
  )
}
