export interface IUserModel {
  id: string
  name: string
  email: string
  password: string
  // role: UserRoles
}

export enum UserRoles {
  admin = 'admin',
  manager = 'manager',
  employee = 'employee'
}
