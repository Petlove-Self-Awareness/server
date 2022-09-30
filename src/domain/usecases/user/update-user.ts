import { Result } from '../../logic/result'
import { IUserModel } from '../../models/user-model'

export interface UpdateUserData {
  id: string
  name?: string
  email?: string
  password?: string
}

export interface IUpdateUserUseCase {
  update: (updateUserData: UpdateUserData) => Promise<Result<IUserModel>>
}
