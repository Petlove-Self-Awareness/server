import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { badRequest } from '../helpers/http-helpers'
import { IController } from '../protocols/controller'
import { IEmailValidator } from '../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../protocols/http'

//name, email, password, passwordConfirmation
////cargos e senioridades serão definidos ao entrar na empresa

export class SignupController implements IController {
  private readonly emailValidator: IEmailValidator
  constructor(emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
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

    const httpResponse: HttpResponse = {
      statusCode: 200,
      body: {}
    }
    return new Promise(resolve => resolve(httpResponse))
  }
}
