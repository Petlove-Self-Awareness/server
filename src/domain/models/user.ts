import { Result } from '../logic/result'
import { SignupData } from '../usecases/signup'
import { UserEmail } from '../value-objects/user-email'
import { UserName } from '../value-objects/user-name'
import { UserPassword } from '../value-objects/user-password'
import { IUserModel, UserRoles } from './user-model'

export interface UserCreationProps {
  id: string
  name: UserName
  email: UserEmail
  password: UserPassword
  role: UserRoles
}

export class User {
  private id: string
  private name: UserName
  private email: UserEmail
  private password: UserPassword
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

  set updateName(name: UserName) {
    this.name = name
  }

  set updateEmail(email: UserEmail) {
    this.email = email
  }

  set updatePassword(password: UserPassword) {
    this.password = password
  }

  public static create(props: SignupData, id: string): Result<User> {
    const { email, name, password, role } = props
    const nameOrError = UserName.create(name)
    const passwordOrError = UserPassword.create(password)
    const emailOrError = UserEmail.create(email)
    const creations: Result<any>[] = [nameOrError, emailOrError, passwordOrError]
    const creationResults = Result.combine(creations)
    if (creationResults.isFailure) {
      return Result.fail(creationResults.error)
    }
    const user = new User({
      id,
      email: emailOrError.getValue(),
      name: nameOrError.getValue(),
      password: passwordOrError.getValue(),
      role
    })
    return Result.ok<User>(user)
  }

  public convertToModel(): IUserModel {
    return {
      id: this.id,
      name: this.name.value,
      email: this.email.value,
      password: this.password.value,
      role: this.role
    }
  }
}
