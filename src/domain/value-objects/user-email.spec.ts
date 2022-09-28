import { UserEmail } from './user-email'

describe('UserEmail', () => {
  test('Should returns Result fail if email not provided', () => {
    const result = UserEmail.create('')
    expect(result.isFailure).toBe(true)
  })
})
