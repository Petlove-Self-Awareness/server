import { ValueObject } from './value-object'
import { Result } from '../logic/result'

interface UserNameProps {
  name: string
}

export class UserName extends ValueObject<UserNameProps> {
  get value(): string {
    return this.props.name
  }

  private constructor(props: UserNameProps) {
    super(props)
  }

  public static create(name: string): Result<UserName> {
    if (!name) {
      return Result.fail<UserName>('User name cannot be empty')
    }
    name = name.trim()
    if (name.length < 5 || name.length > 20) {
      return Result.fail<UserName>(
        'User name must be between 5 and 20 characters'
      )
    }
    const containNumbersRegex = /[0-9]/g
    if (containNumbersRegex.test(name)) {
      return Result.fail<UserName>('User name must not contain numbers')
    }
    const createdName = new UserName({ name })
    return Result.ok<UserName>(createdName)
  }
}
