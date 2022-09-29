import { UpdateUserDto } from '../../../../domain/usecases/user/update-user'

export interface IUpdateUserRepository {
  update: (data: UpdateUserDto) => Promise<void>
}
