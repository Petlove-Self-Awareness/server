import {
  HttpRequest,
  HttpResponse,
  IMiddleware,
  ILoadUserByToken,
  unauthorized,
  ok,
  serverError
} from './auth-middlware-protocols'

export class AuthMiddleware implements IMiddleware {
  constructor(private readonly loadUserByToken: ILoadUserByToken) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { headers } = httpRequest
      const accessToken = headers?.['x-access-token']
      if (accessToken) {
        const userResult = await this.loadUserByToken.load(accessToken)
        if (userResult.isFailure) {
          return unauthorized()
        }
        const user = userResult.getValue()
        return ok({ userId: user.id })
      }
      return unauthorized()
    } catch (error) {
      return serverError(error)
    }
  }
}
