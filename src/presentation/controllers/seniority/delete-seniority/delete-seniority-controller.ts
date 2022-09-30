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
  IDeleteSeniorityUseCase,
  ILoadUserByIdUseCase
} from './delete-seniority-protocols'

export class DeleteSeniorityController implements IController {
  constructor(
    private readonly deleteSeniorityUseCase: IDeleteSeniorityUseCase,
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
      const { seniorityId } = httpRequest.params
      if (!seniorityId) {
        return badRequest(
          new MissingParamError('You must provide a "seniorityId" in params')
        )
      }
      const result = await this.deleteSeniorityUseCase.delete(seniorityId)
      if (result.isFailure) {
        return notFound(result.error)
      }
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
