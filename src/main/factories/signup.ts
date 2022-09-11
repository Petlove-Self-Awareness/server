import { IController } from '../../presentation/protocols/controller'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbSingup } from '../../data/usecases/db-signup'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { UUIDBuilder } from '../../utils/uuid-adapter'
import { UserPostgresRepository } from '../../infra/db/postgres/user-repository'
import { PrismaClient } from '@prisma/client'
import { SignupController } from '../../presentation/controllers/signup'

export const makeSignupController = (): IController => {
  const emailValidator = new EmailValidatorAdapter()

  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const uuidBuilder = new UUIDBuilder()
  const prismaClient = new PrismaClient()
  const userPostgresRepo = new UserPostgresRepository(prismaClient)
  const signup = new DbSingup(bcryptAdapter, uuidBuilder, userPostgresRepo)

  return new SignupController(emailValidator, signup)
}
