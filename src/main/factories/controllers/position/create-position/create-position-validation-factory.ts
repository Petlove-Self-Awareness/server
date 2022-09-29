import {
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../../validation/validators'
import { IValidation } from '../../../../../presentation/protocols/validation'

export const makeCreatePositionValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  validations.push(new RequiredFieldValidation('positionName'))
  return new ValidationComposite(validations)
}
