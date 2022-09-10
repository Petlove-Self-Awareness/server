import { User } from './domain/models/user'
import { BcryptAdapter } from './infra/criptography/bcrypt-adapter'

const user = User.create({
  id: '2',
  email: 'aaa@aaa.com',
  name: 'daniel',
  password: '123'
})

let name = user.userName
console.log(name)

const bcryptAdapter = new BcryptAdapter(12)
bcryptAdapter.encrypt(name).then(res => console.log(res))
