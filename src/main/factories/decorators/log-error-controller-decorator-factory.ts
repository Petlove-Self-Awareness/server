import { PrismaHelper } from '../../../infra/db/helpers/prisma-helper'
import { LogPostgresRepository } from '../../../infra/db/postgres/log/log-error-postgres-repository'
import { IController } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'

export const makeLogControllerDecorator = (
  controller: IController
): IController => {
  const logPostgresRepository = new LogPostgresRepository(PrismaHelper.client)
  return new LogControllerDecorator(controller, logPostgresRepository)
}
