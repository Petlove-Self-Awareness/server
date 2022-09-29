import {
  IController,
  HttpRequest,
  HttpResponse,
  serverError,
  unauthorized,
  badRequest,
  notFound,
  noContent,
  forbidden,
  MissingParamError,
  UnauthorizedError,
  IDeletePositionUseCase,
  ILoadUserByIdUseCase
} from './delete-position-protocols'

export class DeletePositionController implements IController {
  constructor(
    private readonly deletePositionUseCase: IDeletePositionUseCase,
    private readonly loadUserByIdUseCase: ILoadUserByIdUseCase
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = httpRequest
      if (!userId) {
        return unauthorized()
      }
      const client = await this.loadUserByIdUseCase.load(userId)
      if (client.getValue().role !== 'admin') {
        return forbidden(new UnauthorizedError())
      }
      const { positionId } = httpRequest.params
      if (!positionId) {
        return badRequest(
          new MissingParamError('You must provide a "positionId" in params')
        )
      }
      const result = await this.deletePositionUseCase.delete(positionId)
      if (result.isFailure) {
        return notFound(result.error)
      }
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
