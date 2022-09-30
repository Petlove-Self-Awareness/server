import { DeleteSeniorityController } from '../../../../../presentation/controllers/seniority/delete-seniority/delete-seniority-controller'
import { IController } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-error-controller-decorator-factory'
import { makeDbDeleteSeniority } from '../../../usecases/seniority/delete-seniority-usecase-factory'
import { makeDbLoadUserByUniqueKey } from '../../../usecases/user/load-user-by-email-usecase-factory'

export const makeDeleteSeniorityController = (): IController => {
  return makeLogControllerDecorator(
    new DeleteSeniorityController(makeDbDeleteSeniority(), makeDbLoadUserByUniqueKey())
  )
}
