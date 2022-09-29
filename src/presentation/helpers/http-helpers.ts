import { ServerError, UnauthorizedError } from '../errors'
import { HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unprocessableEntity = (error: string): HttpResponse => ({
  statusCode: 422,
  body: { message: error }
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: {}
})

export const notFound = (error: string): HttpResponse => ({
  statusCode: 404,
  body: { message: error }
})
