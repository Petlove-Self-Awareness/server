import { DeletePositionController } from '../../../../../presentation/controllers/position/delete-position/delete-position-controller'
import { IController } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-error-controller-decorator-factory'
import { makeDbDeletePosition } from '../../../usecases/position/delete-position-usecase-factory'
import { makeDbLoadUserByEmail } from '../../../usecases/user/load-user-by-email-usecase-factory'

export const makeDeletePositionController = (): IController => {
  return makeLogControllerDecorator(
    new DeletePositionController(
      makeDbDeletePosition(),
      makeDbLoadUserByEmail()
    )
  )
}
