import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeCreatePositionController } from '../factories/controllers/position/create-position/create-position-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middlware-factory'

export const positionRouter = Router()

positionRouter.post(
  '',
  adaptMiddleware(makeAuthMiddleware()),
  adaptRoute(makeCreatePositionController())
)
