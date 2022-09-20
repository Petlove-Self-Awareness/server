import { IController } from '../../presentation/protocols/controller'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbSignUp } from '../../data/usecases/signup/db-signup'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { UUIDAdapter } from '../../utils/uuid-adapter'
import { UserPostgresRepository } from '../../infra/db/postgres/user-postgres-repository'
import { PrismaClient } from '@prisma/client'
import { SignupController } from '../../presentation/controllers/signup-controller'

export const makeSignupController = (): IController => {
  const emailValidator = new EmailValidatorAdapter()

  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const uuidBuilder = new UUIDAdapter()
  const prismaClient = new PrismaClient()
  const userPostgresRepo = new UserPostgresRepository(prismaClient)
  const signup = new DbSignUp(bcryptAdapter, uuidBuilder, userPostgresRepo)

  return new SignupController(emailValidator, signup)
}
