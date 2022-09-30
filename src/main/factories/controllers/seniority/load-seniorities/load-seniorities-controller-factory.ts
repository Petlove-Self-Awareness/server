import { LoadSenioritiesController } from '../../../../../presentation/controllers/seniority/load-seniorities/load-seniorities-controller'
import { IController } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-error-controller-decorator-factory'
import { makeDbLoadSeniorities } from '../../../usecases/seniority/load-seniorities-usecase-factory'

export const makeLoadSenioritiesController = (): IController => {
  return makeLogControllerDecorator(
    new LoadSenioritiesController(makeDbLoadSeniorities())
  )
}
