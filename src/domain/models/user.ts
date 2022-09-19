import { Result } from '../logic/result'
import { SignupData } from '../usecases/signup'
import { UserName } from '../value-objects/user-name'

export interface UserCreationProps {
  id: string
  name: UserName
  email: string
  password: string
}

export class User {
  private id: string
  private name: UserName
  private email: string
  private password: string

  private constructor(props: UserCreationProps) {
    this.id = props.id
    this.email = props.email
    this.name = props.name
    this.password = props.password
  }

  get userName(): UserName {
    return this.name
  }

  public static create(props: SignupData, id: string): Result<User> {
    const { email, name, password } = props
    const nameOrError = UserName.create(name)
    if (nameOrError.isFailure) {
      return Result.fail(nameOrError.error)
    }
    const user = new User({ id, email, name: nameOrError.getValue(), password })
    return Result.ok<User>(user)
  }
}
