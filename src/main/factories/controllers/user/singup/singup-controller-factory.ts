import { SignupController } from '../../../../../presentation/controllers/signup-controller'
import { IController } from '../../../../../presentation/protocols/controller'
import { makeLogControllerDecorator } from '../../../decorators/log-error-controller-decorator-factory'
import { makeDbSignUp } from '../../../usecases/user/singup/signup-usecase-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): IController => {
  return makeLogControllerDecorator(
    new SignupController(makeDbSignUp(), makeSignUpValidation())
  )
}
