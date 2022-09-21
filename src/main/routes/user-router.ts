import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController } from '../factories/controllers/user/login/login-controller-factory'
import { makeSignUpController } from '../factories/controllers/user/singup/singup-controller-factory'

export const userRouter = Router()

userRouter.post('', async (req, res) => {
  const route = adaptRoute(makeSignUpController())
  return route(req, res)
})

userRouter.post('/login', async (req, res) => {
  const route = adaptRoute(makeLoginController())
  return route(req, res)
})
