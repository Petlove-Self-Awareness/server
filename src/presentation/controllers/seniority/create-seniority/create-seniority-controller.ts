import {
  ICreateSeniorityUseCase,
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
} from './create-seniority-protocols'

export class CreateSeniorityController implements IController {
  constructor(
    private readonly validator: IValidation,
    private readonly createSeniority: ICreateSeniorityUseCase,
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
      const { seniorityName } = body
      const seniorityOrError = await this.createSeniority.create(seniorityName)
      if (seniorityOrError.isFailure) {
        return unprocessableEntity(seniorityOrError.error)
      }
      const seniority = seniorityOrError.getValue()
      return ok(seniority)
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
