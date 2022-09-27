import { IUpdateUserUseCase } from '../../../../domain/usecases/user/update-user'
import {
  badRequest,
  HttpRequest,
  HttpResponse,
  IController,
  IValidation
} from '../login/login-controller-protocols'

export class UpdateUserController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly userUpdateUseCase: IUpdateUserUseCase
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return badRequest(error)
    }

    const dataToUpdate = Object.assign(httpRequest.body, {
      id: httpRequest.accountId
    })

    await this.userUpdateUseCase.update(dataToUpdate)
    return null
  }
}
