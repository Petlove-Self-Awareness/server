import { UserEmail } from './user-email'

describe('UserEmail', () => {
  test('Should returns Result fail if email not provided', () => {
    const result = UserEmail.create('')
    expect(result.isFailure).toBe(true)
  })

  test('Should returns Result fail if email is invalid', () => {
    const result = UserEmail.create('email_invalid.com')
    expect(result.isFailure).toBe(true)
  })
})
