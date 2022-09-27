import { Result } from '../../logic/result'
import { IUserModel } from '../../models/user-model'

export interface UpdateUserDto {
  id: string;
  name: string
  email: string
  password: string
}

export interface IUpdateUserUseCase {
  update: (updateUserDto: UpdateUserDto) => Promise<Result<IUserModel>>
}
