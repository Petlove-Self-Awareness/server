import { AuthMiddleware } from '../../../presentation/middleware/auth-middleware'
import { IMiddleware } from '../../../presentation/protocols/middleware'
import { makeDbLoadUserByToken } from '../usecases/user/load-user-by-token/load-user-by-token-usecase-factory'

export const makeAuthMiddleware = (): IMiddleware => {
  return new AuthMiddleware(makeDbLoadUserByToken())
}
