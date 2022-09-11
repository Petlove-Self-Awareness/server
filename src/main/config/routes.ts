import { Express } from 'express'
import { userRouter } from '../routes/user-router'

export default (app: Express): void => {
  app.use('/user', userRouter)
}
