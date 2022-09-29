import { CreateSeniorityController } from '../../../../../presentation/controllers/seniority/create-seniority/create-seniority-controller'
import { IController } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-error-controller-decorator-factory'
import { makeDbCreateSeniorityUseCase } from '../../../usecases/seniority/create-seniority-usecase-factory'
import { makeDbLoadUserByEmail } from '../../../usecases/user/load-user-by-email-usecase-factory'
import { makeCreateSeniorityValidation } from './create-seniority-validation-factory'

export const makeCreateSeniorityController = (): IController => {
  return makeLogControllerDecorator(
    new CreateSeniorityController(
      makeCreateSeniorityValidation(),
      makeDbCreateSeniorityUseCase(),
      makeDbLoadUserByEmail()
    )
  )
}
