import { CompareFieldsValidation } from '../../../../../validation/validators/compare-fields-validation'
import { EmailValidation } from '../../../../../validation/validators/email-validation'
import { RequiredFieldValidation } from '../../../../../validation/validators/required-field-validation'
import { ValidationComposite } from '../../../../../validation/validators/validation-composite'
import { IValidation } from '../../../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../../../infra/adapters/validators/email-validator-adapter'

const makeEmailValidatorAdapter = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  )
  validations.push(new EmailValidation(makeEmailValidatorAdapter(), 'email'))

  return new ValidationComposite(validations)
}
