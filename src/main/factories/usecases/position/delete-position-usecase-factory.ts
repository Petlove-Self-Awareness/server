import { DbDeletePosition } from '../../../../data/usecases/position/delete-position/db-delete-position-protocols'
import { IDeletePositionUseCase } from '../../../../domain/usecases/position/delete-position'
import { PrismaHelper } from '../../../../infra/db/helpers/prisma-helper'
import { PositionPostgresRepository } from '../../../../infra/db/postgres/position-postgres-repository'

export const makeDbDeletePosition = (): IDeletePositionUseCase => {
  const positionPostgresRepository = new PositionPostgresRepository(
    PrismaHelper.client
  )
  return new DbDeletePosition(positionPostgresRepository)
}
