import { Result } from '../logic/result'
import { ValueObject } from './value-object'

interface UserPasswordProps {
  password: string
}

export class UserPassword extends ValueObject<UserPasswordProps> {
  get value(): string {
    return this.props.password
  }

  private constructor(props: UserPasswordProps) {
    super(props)
  }

  public static create(password: string): Result<UserPassword> {
    if (!password) {
      return Result.fail<UserPassword>('User password cannot be empty')
    }
    if (password.length < 8) {
      return Result.fail<UserPassword>(
        'User password must be at least 8 characters'
      )
    }
    const validatorPasswordRegex =
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
    if (!validatorPasswordRegex.test(password)) {
      return Result.fail<UserPassword>('Password too weak')
    }

    const createdPassword = new UserPassword({ password })
    return Result.ok<UserPassword>(createdPassword)
  }
}
