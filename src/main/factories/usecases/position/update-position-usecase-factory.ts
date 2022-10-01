import { DbUpdatePosition } from '../../../../data/usecases/position/update-position/db-update-position'
import { IUpdatePositionUseCase } from '../../../../domain/usecases/position/update-position'
import { PrismaHelper } from '../../../../infra/db/helpers/prisma-helper'
import { PositionPostgresRepository } from '../../../../infra/db/postgres/position-postgres-repository'

export const makeDbUpdatePosition = (): IUpdatePositionUseCase => {
  const positionPostgresRepository = new PositionPostgresRepository(PrismaHelper.client)
  return new DbUpdatePosition(positionPostgresRepository, positionPostgresRepository)
}
