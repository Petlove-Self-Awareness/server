import { UpdatePositionController } from '../../../../../presentation/controllers/position/update-position/update-position-controller'
import { IController } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-error-controller-decorator-factory'
import { makeDbUpdatePosition } from '../../../usecases/position/update-position-usecase-factory'
import { makeDbLoadUserByUniqueKey } from '../../../usecases/user/load-user-by-email-usecase-factory'
import { makeCreatePositionValidation } from '../create-position/create-position-validation-factory'

export const makeUpdatePositionController = (): IController => {
  return makeLogControllerDecorator(
    new UpdatePositionController(
      makeCreatePositionValidation(),
      makeDbUpdatePosition(),
      makeDbLoadUserByUniqueKey()
    )
  )
}
