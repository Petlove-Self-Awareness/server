import { IUpdateUserUseCase } from '../../../../domain/usecases/user/update-user'
import {
  HttpRequest,
  HttpResponse,
  IController
} from '../login/login-controller-protocols'

export class UpdateUserController implements IController {
  constructor(private readonly userUpdateUseCase: IUpdateUserUseCase,) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const userRequest = Object.assign(httpRequest.body, {
      id: httpRequest.accountId
    })
    await this.userUpdateUseCase.update(userRequest)
    return null
  }
}
