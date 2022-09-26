import { Result } from '../logic/result'
import { ValueObject } from './value-object'

interface PositionNameProps {
  name: string
}

export class PositionName extends ValueObject<PositionNameProps> {
  get value(): string {
    return this.props.name
  }

  private constructor(props: PositionNameProps) {
    super(props)
  }

  public static create(name: string): Result<PositionName> {
    if (!name) {
      return Result.fail('Position name cannot be empty')
    }
    name = name.trim()
    if (name.length < 3 || name.length > 30) {
      return Result.fail('Position name must be between 3 and 30 characters')
    }
    const containNumbersRegex = /[0-9]/g
    if (containNumbersRegex.test(name)) {
      return Result.fail('Position name must not contain numbers')
    }
    const createdPosition = new PositionName({ name })
    return Result.ok<PositionName>(createdPosition)
  }
}
