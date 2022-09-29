import {
  ICreatePositionUseCase,
  ILoadUserByIdUseCase,
  HttpRequest,
  HttpResponse,
  IController,
  IValidation,
  forbidden,
  badRequest,
  ok,
  serverError,
  unprocessableEntity,
  UnauthorizedError
} from './create-position-protocols'

export class CreatePositionController implements IController {
  constructor(
    private readonly validator: IValidation,
    private readonly createPosition: ICreatePositionUseCase,
    private readonly loadUserById: ILoadUserByIdUseCase
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId, body } = httpRequest
      const client = await this.loadUserById.load(userId)
      if (client.getValue().role !== 'admin') {
        return forbidden(new UnauthorizedError())
      }
      const error = this.validator.validate(body)
      if (error) {
        return badRequest(error)
      }
      const { positionName } = body
      const positionOrError = await this.createPosition.create(positionName)
      if (positionOrError.isFailure) {
        return unprocessableEntity(positionOrError.error)
      }
      const position = positionOrError.getValue()
      return ok(position)
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
