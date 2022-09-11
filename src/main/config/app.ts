import express from 'express'
import setupMiddlewares from './middlewares'
import routers from './routes'

const app = express()
setupMiddlewares(app)
routers(app)

export default app
