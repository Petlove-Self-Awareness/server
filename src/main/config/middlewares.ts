import { Express } from 'express'
import { cors } from '../middlewares/cors'
import { contentType } from '../middlewares/content_type'
import { bodyParser } from '../middlewares/bodyParser'

export default (app: Express): void => {
  app.use(cors)
  app.use(contentType)
  app.use(bodyParser)
}
