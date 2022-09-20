import {
  IController,
  IValidation,
  HttpRequest,
  HttpResponse,
  ok,
  badRequest,
  serverError,
  unauthorized,
  ILogin
} from './login-controller-protocols'

export class LoginController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly loginUseCase: ILogin
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const accessToken = await this.loginUseCase.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
