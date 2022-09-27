import { IUpdateUserUseCase } from '../../../../domain/usecases/user/update-user'
import {
  badRequest,
  HttpRequest,
  HttpResponse,
  IController,
  InvalidParamError,
  MissingParamError,
  ok,
  serverError
} from '../login/login-controller-protocols'

export class UpdateUserController implements IController {
  constructor(private readonly userUpdateUseCase: IUpdateUserUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (!name && !email && !password) {
        return badRequest(
          new MissingParamError('name, email or password not informed')
        )
      }
      if (password && !passwordConfirmation) {
        return badRequest(
          new MissingParamError('password confirmation not informed')
        )
      }
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const dataToUpdate = Object.assign(httpRequest.body, {
        id: httpRequest.accountId
      })
      const updatedUser = await this.userUpdateUseCase.update(dataToUpdate)
      return ok(updatedUser.getValue())
    } catch (error) {
      return serverError(error)
    }
  }
}
