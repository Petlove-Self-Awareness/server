import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController } from '../factories/controllers/user/login/login-controller-factory'
import { makeSignUpController } from '../factories/controllers/user/singup/singup-controller-factory'
import { makeUpdateUserController } from '../factories/controllers/user/update-user/update-user-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middlware-factory'

export const userRouter = Router()

userRouter.post('', async (req, res) => {
  const route = adaptRoute(makeSignUpController())
  return route(req, res)
})

userRouter.post('/login', async (req, res) => {
  const route = adaptRoute(makeLoginController())
  return route(req, res)
})

userRouter.patch(
  '/update',
  adaptMiddleware(makeAuthMiddleware()),
  adaptRoute(makeUpdateUserController())
)
