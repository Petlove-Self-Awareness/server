import {
  HttpRequest,
  HttpResponse,
  IController,
  unauthorized,
  serverError,
  ok,
  notFound,
  ILoadPositions
} from './load-positions-controller-protocols'

export class LoadPositionsController implements IController {
  constructor(private readonly loadPositionsUseCase: ILoadPositions) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const client = httpRequest.userId
      if (!client) {
        return unauthorized()
      }
      const positionsResult = await this.loadPositionsUseCase.loadAll()
      if (positionsResult.isFailure) {
        return notFound(positionsResult.error)
      }
      const positions = positionsResult.getValue()
      return ok(positions)
    } catch (error) {
      return serverError(error)
    }
  }
}
