import {
  HttpRequest,
  HttpResponse,
  ILoadSeniorityByIdUseCase,
  badRequest,
  MissingParamError,
  notFound,
  ok,
  serverError,
  unauthorized
} from './load-seniority-by-id-protocols'
import { IController } from './load-seniority-by-id-protocols'

export class LoadSeniorityByIdController implements IController {
  constructor(private readonly loadSeniorityByIdUseCase: ILoadSeniorityByIdUseCase) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const client = httpRequest.userId
      if (!client) {
        return unauthorized()
      }
      const { seniorityId } = httpRequest.params
      if (!seniorityId) {
        return badRequest(
          new MissingParamError('You must provide a "seniorityId" in params')
        )
      }
      const seniority = await this.loadSeniorityByIdUseCase.loadById(seniorityId)
      if (seniority.isFailure) {
        return notFound(seniority.error)
      }
      const data = seniority.getValue()
      return ok(data)
    } catch (error) {
      return serverError(error)
    }
  }
}
