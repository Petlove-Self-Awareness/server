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
    
  }
}
