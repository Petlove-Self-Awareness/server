import {
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../../validation/validators'
import { IValidation } from '../../../../../presentation/protocols/validation'

export const makeCreateSeniorityValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  validations.push(new RequiredFieldValidation('seniorityName'))
  return new ValidationComposite(validations)
}
