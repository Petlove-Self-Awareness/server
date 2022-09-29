import { UserPassword } from './user-password'

describe('UserPassword', () => {
  test('Should return fails if password not provided', () => {
    const result = UserPassword.create('')
    expect(result.isFailure).toBe(true)
  })

  test('Should return fails if the password length is less than 8 characters', () => {
    const result = UserPassword.create('123abc@')
    expect(result.isFailure).toBe(true)
  })

  test('Should return fails if the password is weak', () => {
    const result = UserPassword.create('123abc@123h8912')
    expect(result.isFailure).toBe(true)
  })

  test('Should return UserPassword if the password passes validations', () => {
    const result = UserPassword.create('Abc@1234')
    expect(result.isSuccess).toBe(true)
  })
})
