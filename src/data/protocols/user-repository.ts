import { IUserDataProps } from '../../domain/models/user'

export interface IUserRepo {
  signUp: (userData: IUserDataProps) => Promise<void>
}
