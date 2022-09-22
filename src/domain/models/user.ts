import { Result } from '../logic/result'
import { SignupData } from '../usecases/signup'
import { UserName } from '../value-objects/user-name'
import { UserRoles } from './user-model'

export interface UserCreationProps {
  id: string
  name: UserName
  email: string
  password: string
  role: UserRoles
}

export class User {
  private id: string
  private name: UserName
  private email: string
  private password: string
  private role: UserRoles

  private constructor(props: UserCreationProps) {
    this.id = props.id
    this.email = props.email
    this.name = props.name
    this.password = props.password
    this.role = props.role
  }

  get userName(): UserName {
    return this.name
  }

  get userRole(): UserRoles {
    return this.userRole
  }

  public static create(props: SignupData, id: string): Result<User> {
    const { email, name, password, role } = props
    const nameOrError = UserName.create(name)
    const creations: Result<any>[] = [nameOrError]
    const creationResults = Result.combine(creations)
    if (creationResults.isFailure) {
      return Result.fail(creationResults.error)
    }
    const user = new User({
      id,
      email,
      name: nameOrError.getValue(),
      password,
      role
    })
    return Result.ok<User>(user)
  }
}
