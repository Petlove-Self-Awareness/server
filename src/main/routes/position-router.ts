import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middlware-factory'

export const positionRouter = Router()

positionRouter.post('', adaptMiddleware(makeAuthMiddleware()))
