export interface IUserDataProps {
  id: string
  name: string
  email: string
  password: string
}

export class User {
  private id: string
  private name: string
  private email: string
  private password: string

  private constructor(props: IUserDataProps) {
    this.id = props.id
    this.email = props.email
    this.name = props.name
    this.password = props.password
  }

  public static create(props: IUserDataProps): User {
    return new User(props)
  }

  get userName(): string {
    return this.name
  }

  get userEmail(): string {
    return this.email
  }

  get userId(): string {
    return this.id
  }

  set setUserPassword(value: string) {
    if (!value) {
      throw new Error('Password cannot be an empty value')
    }
    if (value.length < 6 || value.length > 15) {
      throw new Error('Passowrd must be between 6 and 15 characters')
    }
    if (value.includes(' ')) {
      throw new Error('Password cannot contain spaces')
    }
    this.password = value
  }
}
