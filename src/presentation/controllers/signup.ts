import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { badRequest } from '../helpers/http-helpers'
import { IController } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

//name, email, password, passwordConfirmation
////cargos e senioridades serão definidos ao entrar na empresa

export class SignupController implements IController {
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

    const httpResponse: HttpResponse = {
      statusCode: 200,
      body: {}
    }
    return new Promise(resolve => resolve(httpResponse))
  }
}
