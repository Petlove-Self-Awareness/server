import { IUserDataProps } from '../../domain/models/user'

export interface IUserRepo {
  add: (userData: IUserDataProps) => Promise<IUserDataProps>
}
