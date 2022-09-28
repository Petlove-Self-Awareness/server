import { DbLoadPositions } from '../../../../data/usecases/position/load-positions/db-load-positions'
import { ILoadPositions } from '../../../../domain/usecases/position/load-positions'
import { PrismaHelper } from '../../../../infra/db/helpers/prisma-helper'
import { PositionPostgresRepository } from '../../../../infra/db/postgres/position-postgres-repository'

export const makeDbLoadPositions = (): ILoadPositions => {
  const positionPostgresRepository = new PositionPostgresRepository(
    PrismaHelper.client
  )
  return new DbLoadPositions(positionPostgresRepository)
}
