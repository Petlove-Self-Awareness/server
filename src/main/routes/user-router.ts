import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSignupController } from '../factories/signup'

export const userRouter = Router()

userRouter.post('', async (req, res) => {
  const route = adaptRoute(makeSignupController())
  return route(req, res)
})
