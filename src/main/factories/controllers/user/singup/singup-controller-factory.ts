import { SignupController } from '../../../../../presentation/controllers/user/signup/signup-controller'
import { IController } from '../../../../../presentation/protocols/controller'
import { makeLogControllerDecorator } from '../../../decorators/log-error-controller-decorator-factory'
import { makeDbLogin } from '../../../usecases/user/login-usecase-factory'
import { makeDbSignUp } from '../../../usecases/user/signup-usecase-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): IController => {
  return makeLogControllerDecorator(
    new SignupController(makeDbSignUp(), makeSignUpValidation(), makeDbLogin())
  )
}
