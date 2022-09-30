import { LoadSeniorityByIdController } from '../../../../../presentation/controllers/seniority/load-seniority-by-id/load-seniority-by-id-controller'
import { IController } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-error-controller-decorator-factory'
import { makeDbLoadSeniorityById } from '../../../usecases/seniority/load-seniority-by-id-usecase-factory'

export const makeLoadSeniorityByIdController = (): IController => {
  return makeLogControllerDecorator(
    new LoadSeniorityByIdController(makeDbLoadSeniorityById())
  )
}
