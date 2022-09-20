import { LogPostgresRepository } from '../../../infra/db/postgres/log/log-error-postgres-repository'
import { IController } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { prisma } from '../usecases/prisma-helper'

export const makeLogControllerDecorator = (
  controller: IController
): IController => {
  const logPostgresRepository = new LogPostgresRepository(prisma)
  return new LogControllerDecorator(controller, logPostgresRepository)
}
