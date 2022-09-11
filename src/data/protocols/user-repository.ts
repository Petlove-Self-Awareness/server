import { IUserDataProps, User } from '../../domain/models/user'

export interface IUserRepo {
  signUp: (userData: IUserDataProps) => Promise<void>
  findUserByEmailOrId: (email: string) => Promise<User>
}
