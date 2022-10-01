import {
  IController,
  HttpRequest,
  HttpResponse,
  IUpdatePositionUseCase,
  ILoadUserByIdUseCase,
  IValidation,
  unauthorized,
  badRequest,
  ok,
  serverError,
  unprocessableEntity,
  MissingParamError,
  forbidden,
  UnauthorizedError
} from './update-position-controller-protocols'

export class UpdatePositionController implements IController {
  constructor(
    private readonly validator: IValidation,
    private readonly updatePositionUseCase: IUpdatePositionUseCase,
    private readonly loadUserByIdUseCase: ILoadUserByIdUseCase
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body, userId, params } = httpRequest
      if (!userId) return unauthorized()
      const client = await this.loadUserByIdUseCase.load(userId)
      if (client.getValue().role !== 'admin') {
        return forbidden(new UnauthorizedError())
      }

      if (!params?.positionId) {
        return badRequest(
          new MissingParamError('You must provide a "positionId" in params')
        )
      }

      const error = this.validator.validate(body)
      if (error) return badRequest(error)

      const positionOrError = await this.updatePositionUseCase.update({
        id: params.positionId,
        positionName: body.positionName
      })
      if (positionOrError.isFailure) {
        return unprocessableEntity(positionOrError.error)
      }
      
      const data = positionOrError.getValue()
      return ok(data)
    } catch (error) {
      return serverError(error)
    }
  }
}
