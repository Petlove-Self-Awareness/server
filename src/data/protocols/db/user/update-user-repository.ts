import { UpdateUserData } from '../../../../domain/usecases/user/update-user'

export interface IUpdateUserRepository {
  update: (data: UpdateUserData) => Promise<void>
}
