import { InvalidParamError } from '../../errors/invalid-param-error'
import { IValidation } from '../../protocols/validation'

export class CompareFieldsValidation implements IValidation {
  constructor(
    private readonly field: string,
    private readonly fieldToCompare: string
  ) {}
  validate(input: any): Error | null {
    if (this.field !== this.fieldToCompare) {
      return new InvalidParamError(this.fieldToCompare)
    }
    return null
  }
}
