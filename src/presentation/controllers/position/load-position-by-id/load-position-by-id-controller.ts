import {
  HttpRequest,
  HttpResponse,
  ILoadPositionById,
  badRequest,
  MissingParamError,
  notFound,
  ok,
  serverError,
  unauthorized
} from './load-position-by-id-protocols'
import { IController } from './load-position-by-id-protocols'

export class LoadPositionByIdController implements IController {
  constructor(private readonly loadPositionByIdUseCase: ILoadPositionById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const client = httpRequest.userId
      if (!client) {
        return unauthorized()
      }
      const { positionId } = httpRequest.params
      if (!positionId) {
        return badRequest(
          new MissingParamError('You must provide a "positionId" in params')
        )
      }
      const position = await this.loadPositionByIdUseCase.load(positionId)
      if (position.isFailure) {
        return notFound(position.error)
      }
      const data = position.getValue()
      return ok(data)
    } catch (error) {
      return serverError(error)
    }
  }
}
