import {
  HttpRequest,
  HttpResponse,
  IController,
  IValidation,
  badRequest,
  created,
  unprocessableEntity,
  serverError,
  ISingupUseCase,
  ILogin,
  InvalidParamError
} from './signup-controller-protocols'

export class SignupController implements IController {
  constructor(
    private readonly singUpUseCase: ISingupUseCase,
    private readonly validation: IValidation,
    private readonly authentication: ILogin
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      const userOrError = await this.singUpUseCase.signUp({
        email,
        name,
        password
      })
      if (userOrError.isFailure) {
        return unprocessableEntity(userOrError.error)
      }
      const tokenOrError = await this.authentication.auth({ email, password })
      if (tokenOrError.isFailure) {
        return badRequest(new InvalidParamError(tokenOrError.error))
      }
      return created({ accessToken: tokenOrError.getValue() })
    } catch (error) {
      return serverError(error)
    }
  }
}
