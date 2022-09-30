import { DbLoadSeniorities } from '../../../../data/usecases/seniority/load-seniorities/db-load-seniorities'
import { ILoadSenioritiesUseCase } from '../../../../domain/usecases/seniority/load-seniorities'
import { PrismaHelper } from '../../../../infra/db/helpers/prisma-helper'
import { SeniorityPostgresRepository } from '../../../../infra/db/postgres/seniority-postgres-repository'

export const makeDbLoadSeniorities = (): ILoadSenioritiesUseCase => {
  const seniorityPostgresRepository = new SeniorityPostgresRepository(PrismaHelper.client)
  return new DbLoadSeniorities(seniorityPostgresRepository)
}
