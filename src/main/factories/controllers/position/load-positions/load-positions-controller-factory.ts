import { LoadPositionsController } from '../../../../../presentation/controllers/position/load-positions/load-positions-controller'
import { IController } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-error-controller-decorator-factory'
import { makeDbLoadPositions } from '../../../usecases/position/load-positions-usecase-factory'

export const makeLoadPositionsController = (): IController => {
  return makeLogControllerDecorator(
    new LoadPositionsController(makeDbLoadPositions())
  )
}
