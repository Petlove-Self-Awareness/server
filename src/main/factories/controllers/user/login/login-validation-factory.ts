import { EmailValidatorAdapter } from '../../../../../infra/adapters/validators/email-validator-adapter'
import { IValidation } from '../../../../../presentation/protocols'
import { EmailValidation } from '../../../../../validation/validators/email-validation'
import { RequiredFieldValidation } from '../../../../../validation/validators/required-field-validation'
import { ValidationComposite } from '../../../../../validation/validators/validation-composite'

const makeEmailValidatorAdapter = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

export const makeLoginValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation(makeEmailValidatorAdapter(), 'email'))

  return new ValidationComposite(validations)
}
