import { DbCreateSeniorityUseCase } from '../../../../data/usecases/seniority/create-seniority/db-create-seniority'
import { ICreateSeniorityUseCase } from '../../../../domain/usecases/seniority/create-seniority'
import { UUIDAdapter } from '../../../../infra/criptography/uuid/uuid-adapter'
import { PrismaHelper } from '../../../../infra/db/helpers/prisma-helper'
import { SeniorityPostgresRepository } from '../../../../infra/db/postgres/seniority-postgres-repository'

export const makeDbCreateSeniorityUseCase = (): ICreateSeniorityUseCase => {
  const uuidAdapter = new UUIDAdapter()
  const seniorityPostgresRepository = new SeniorityPostgresRepository(
    PrismaHelper.client
  )
  return new DbCreateSeniorityUseCase(
    uuidAdapter,
    seniorityPostgresRepository,
    seniorityPostgresRepository
  )
}
