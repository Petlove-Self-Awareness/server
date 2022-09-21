import { makeLoginValidation } from './login-validation-factory'
import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite
} from '../../../../../validation/validators'
import { IValidation } from '../../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../../../infra/adapters/validators/email-validator-adapter'

jest.mock('../../../../../validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations ', () => {
    makeLoginValidation()
    const validations: IValidation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
