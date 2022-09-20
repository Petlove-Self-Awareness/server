import { Result } from '../logic/result'

export type AuthenticationModel = {
  email: string
  password: string
}

export interface ILogin {
  auth: (authentication: AuthenticationModel) => Promise<Result<string>>
}
