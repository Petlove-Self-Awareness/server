import { LoadPositionByIdController } from '../../../../../presentation/controllers/position/load-position-by-id/load-position-by-id-controller'
import { IController } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-error-controller-decorator-factory'
import { makeDbLoadPositionById } from '../../../usecases/position/load-position-by-id-usecase-factory'

export const makeLoadPositionByIdController = (): IController => {
  return makeLogControllerDecorator(
    new LoadPositionByIdController(makeDbLoadPositionById())
  )
}
