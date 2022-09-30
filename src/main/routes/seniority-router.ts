import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeCreateSeniorityController } from '../factories/controllers/seniority/create-seniority/create-seniority-controller-factory'
import { makeLoadSenioritiesController } from '../factories/controllers/seniority/load-seniorities/load-seniorities-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middlware-factory'

export const seniorityRouter = Router()

seniorityRouter.post(
  '',
  adaptMiddleware(makeAuthMiddleware()),
  adaptRoute(makeCreateSeniorityController())
)

seniorityRouter.get(
  '',
  adaptMiddleware(makeAuthMiddleware()),
  adaptRoute(makeLoadSenioritiesController())
)
