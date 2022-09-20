import { SignupController } from '../../../../../presentation/controllers/signup-controller'
import { IController } from '../../../../../presentation/protocols/controller'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbSignUp } from '../../../usecases/user/singup/signup-usecase-factory'

export const makeSignUpController = (): IController => {
  return new SignupController(makeDbSignUp(), makeSignUpValidation())
}
