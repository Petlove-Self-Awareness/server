import { Result } from '../logic/result'
import { ValueObject } from './value-object'

interface SeniorityNameProps {
  name: string
}

export class SeniorityName extends ValueObject<SeniorityNameProps> {
  get value(): string {
    return this.props.name
  }

  private constructor(props: SeniorityNameProps) {
    super(props)
  }

  public static create(name: string): Result<SeniorityName> {
    if (!name) {
      return Result.fail('Seniority name cannot be empty')
    }
    name = name.trim()
    if (name.length < 4 || name.length > 20) {
      return Result.fail('Seniority name must be between 4 and 20 characters')
    }
    const createdSeniority = new SeniorityName({ name })
    return Result.ok<SeniorityName>(createdSeniority)
  }
}
