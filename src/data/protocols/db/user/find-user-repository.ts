import { Result } from '../../../../domain/logic/result'
import { User } from '../../../../domain/models/user'

export interface IDbFindUser {
  findUserByEmailOrId: (value: string) => Promise<Result<User>>
}
