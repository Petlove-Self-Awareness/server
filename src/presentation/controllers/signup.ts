import { ISingupUseCase } from '../../domain/usecases/signup'
import { badRequest, created, serverError } from '../helpers/http-helpers'
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
      await this.singUpUseCase.signUp({ email, name, password })
      return created()
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
