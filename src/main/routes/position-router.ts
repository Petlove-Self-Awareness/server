import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeCreatePositionController } from '../factories/controllers/position/create-position/create-position-controller-factory'
import { makeDeletePositionController } from '../factories/controllers/position/delete-position/delete-position-controller-factory'
import { makeLoadPositionByIdController } from '../factories/controllers/position/load-position-by-id/load-position-by-id-controller-factory'
import { makeLoadPositionsController } from '../factories/controllers/position/load-positions/load-positions-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middlware-factory'

export const positionRouter = Router()

positionRouter.post(
  '',
  adaptMiddleware(makeAuthMiddleware()),
  adaptRoute(makeCreatePositionController())
)

positionRouter.get(
  '/:positionId',
  adaptMiddleware(makeAuthMiddleware()),
  adaptRoute(makeLoadPositionByIdController())
)

positionRouter.get(
  '',
  adaptMiddleware(makeAuthMiddleware()),
  adaptRoute(makeLoadPositionsController())
)

positionRouter.delete(
  '/:positionId',
  adaptMiddleware(makeAuthMiddleware()),
  adaptRoute(makeDeletePositionController())
)
