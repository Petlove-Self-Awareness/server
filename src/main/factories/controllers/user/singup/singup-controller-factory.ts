import { SignupController } from '../../../../../presentation/controllers/signup-controller'
import { IController } from '../../../../../presentation/protocols/controller'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbSignUp } from '../../../usecases/user/singup/signup-usecase-factory'
import { makeLogControllerDecorator } from '../../../decorators/log-error-controller-decorator-factory'

export const makeSignUpController = (): IController => {
  return makeLogControllerDecorator(
    new SignupController(makeDbSignUp(), makeSignUpValidation())
  )
}
