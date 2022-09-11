import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { badRequest, created, ok, serverError } from '../helpers/http-helpers'
import { IController } from '../protocols/controller'
import { IEmailValidator } from '../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { ISingupUseCase } from '../../domain/usecases/signup'

export class SignupController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly signup: ISingupUseCase
  constructor(emailValidator: IEmailValidator, singup: ISingupUseCase) {
    this.emailValidator = emailValidator
    this.signup = singup
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      await this.signup.add({ email, name, password })
      return created()
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
