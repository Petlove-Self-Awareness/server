import { Express } from 'express'
import { positionRouter } from '../routes/position-router'
import { seniorityRouter } from '../routes/seniority-router'
import { userRouter } from '../routes/user-router'

export default (app: Express): void => {
  app.use('/user', userRouter)
  app.use('/position', positionRouter)
  app.use('/seniority', seniorityRouter)
}
