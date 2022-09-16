import { ISingupUseCase } from '../../domain/usecases/signup'
import {
  badRequest,
  created,
  serverError,
  unprocessableEntity
} from '../helpers/http-helpers'
import { IController } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { IValidation } from '../protocols/validation'

export class SignupController implements IController {
  constructor(
    private readonly singUpUseCase: ISingupUseCase,
    private readonly validation: IValidation
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
      return created(userOrError.getValue())
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
