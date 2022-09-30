import { DbDeleteSeniority } from '../../../../data/usecases/seniority/delete-seniority/db-delete-seniority'
import { IDeleteSeniorityUseCase } from '../../../../domain/usecases/seniority/delete-seniority'
import { PrismaHelper } from '../../../../infra/db/helpers/prisma-helper'
import { SeniorityPostgresRepository } from '../../../../infra/db/postgres/seniority-postgres-repository'

export const makeDbDeleteSeniority = (): IDeleteSeniorityUseCase => {
  const seniorityPostgresRepository = new SeniorityPostgresRepository(PrismaHelper.client)
  return new DbDeleteSeniority(seniorityPostgresRepository)
}
