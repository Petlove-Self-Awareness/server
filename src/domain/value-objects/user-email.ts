import { Result } from '../logic/result'
import { ValueObject } from './value-object'

interface UserEmailProps {
  email: string
}

export class UserEmail extends ValueObject<UserEmailProps> {
  get value(): string {
    return this.props.email
  }

  private constructor(props: UserEmailProps) {
    super(props)
  }

  public static create(email: string): Result<UserEmail> {
    if (!email) {
      return Result.fail<UserEmail>('User name cannot be empty')
    }
    email = email.trim()
    const validatorEmailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    if (!validatorEmailRegex.test(email)) {
      return Result.fail<UserEmail>('Email provided is invalid')
    }
    const createdEmail = new UserEmail({ email })
    return Result.ok<UserEmail>(createdEmail)
  }
}
