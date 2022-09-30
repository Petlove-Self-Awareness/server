import { DbLoadSeniorityById } from '../../../../data/usecases/seniority/load-seniority-by-id/db-load-seniority-by-id'
import { ILoadSeniorityByIdUseCase } from '../../../../domain/usecases/seniority/load-seniority-by-id'
import { PrismaHelper } from '../../../../infra/db/helpers/prisma-helper'
import { SeniorityPostgresRepository } from '../../../../infra/db/postgres/seniority-postgres-repository'

export const makeDbLoadSeniorityById = (): ILoadSeniorityByIdUseCase => {
  const seniorityPostgresRepository = new SeniorityPostgresRepository(PrismaHelper.client)
  return new DbLoadSeniorityById(seniorityPostgresRepository)
}
