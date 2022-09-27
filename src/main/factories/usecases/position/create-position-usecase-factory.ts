import { DbCreatePositionUseCase } from '../../../../data/usecases/position/create-position/db-create-position'
import { ICreatePositionUseCase } from '../../../../domain/usecases/position/create-position'
import { UUIDAdapter } from '../../../../infra/criptography/uuid/uuid-adapter'
import { PrismaHelper } from '../../../../infra/db/helpers/prisma-helper'
import { PositionPostgresRepository } from '../../../../infra/db/postgres/position-postgres-repository'

export const makeDbCreatePosition = (): ICreatePositionUseCase => {
  const uuidAdapter = new UUIDAdapter()
  const positionPostgresRepository = new PositionPostgresRepository(
    PrismaHelper.client
  )
  return new DbCreatePositionUseCase(
    uuidAdapter,
    positionPostgresRepository,
    positionPostgresRepository
  )
}
