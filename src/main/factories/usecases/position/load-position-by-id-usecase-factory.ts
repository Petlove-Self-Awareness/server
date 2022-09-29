import { DbLoadPositionById } from '../../../../data/usecases/position/load-position-by-id/db-load-position-by-id'
import { ILoadPositionById } from '../../../../domain/usecases/position/load-position-by-id'
import { PrismaHelper } from '../../../../infra/db/helpers/prisma-helper'
import { PositionPostgresRepository } from '../../../../infra/db/postgres/position-postgres-repository'

export const makeDbLoadPositionById = (): ILoadPositionById => {
  const positionPostgresRepository = new PositionPostgresRepository(
    PrismaHelper.client
  )
  return new DbLoadPositionById(positionPostgresRepository)
}
