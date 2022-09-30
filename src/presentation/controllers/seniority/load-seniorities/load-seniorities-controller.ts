import {
  HttpRequest,
  HttpResponse,
  IController,
  unauthorized,
  serverError,
  ok,
  notFound,
  ILoadSenioritiesUseCase
} from './load-seniorities-controller-protocols'

export class LoadSenioritiesController implements IController {
  constructor(private readonly loadSenioritiesUseCase: ILoadSenioritiesUseCase) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const client = httpRequest.userId
      if (!client) {
        return unauthorized()
      }
      const senioritiesResult = await this.loadSenioritiesUseCase.loadAll()
      if (senioritiesResult.isFailure) {
        return notFound(senioritiesResult.error)
      }
      const seniorities = senioritiesResult.getValue()
      return ok(seniorities)
    } catch (error) {
      return serverError(error)
    }
  }
}
