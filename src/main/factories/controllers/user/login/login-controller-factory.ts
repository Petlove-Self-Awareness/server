import { LoginController } from '../../../../../presentation/controllers/user/login/login-controller'
import { IController } from '../../../../../presentation/protocols/controller'
import { makeLogControllerDecorator } from '../../../decorators/log-error-controller-decorator-factory'
import { makeDbLogin } from '../../../usecases/user/login-usecase-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): IController => {
  return makeLogControllerDecorator(
    new LoginController(makeLoginValidation(), makeDbLogin())
  )
}
