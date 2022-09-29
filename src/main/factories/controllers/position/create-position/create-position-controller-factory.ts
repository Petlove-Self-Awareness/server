import { CreatePositionController } from '../../../../../presentation/controllers/position/create-position/create-position-controller'
import { IController } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-error-controller-decorator-factory'
import { makeDbCreatePosition } from '../../../usecases/position/create-position-usecase-factory'
import { makeDbLoadUserByEmail } from '../../../usecases/user/load-user-by-email-usecase-factory'
import { makeCreatePositionValidation } from './create-position-validation-factory'

export const makeCreatePositionController = (): IController => {
  return makeLogControllerDecorator(
    new CreatePositionController(
      makeCreatePositionValidation(),
      makeDbCreatePosition(),
      makeDbLoadUserByEmail()
    )
  )
}
