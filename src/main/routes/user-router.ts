import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSignUpController } from '../factories/controllers/user/singup/singup-controller-factory'

export const userRouter = Router()

userRouter.post('', async (req, res) => {
  const route = adaptRoute(makeSignUpController())
  return route(req, res)
})
