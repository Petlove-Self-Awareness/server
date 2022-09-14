import { UserName } from './user-name'

describe('UserName value object', () => {
  test('Should return fail if name is falsy', () => {
    const result = UserName.create('')
    expect(result.isFailure).toBe(true)
  })

  test('Should return fail if name is shorter than 5 characters', () => {
    const result = UserName.create('abc')
    expect(result.isFailure).toBe(true)
  })

  test('Should return fail if name is longer than 20 characters', () => {
    const result = UserName.create('aaaaaaaaaaaaaaaaaaaaa')
    expect(result.isFailure).toBe(true)
  })

  test('Should create name with no white spaces in edges', () => {
    const result = UserName.create(' daniel ')
    expect(result.getValue().value).toBe('daniel')
  })

  test('Should return fail if a name contains a number', () => {
    const result = UserName.create('daniel9')
    expect(result.isFailure).toBe(true)
  })

  test('Should return an UserName if name passes validations', () => {
    const result = UserName.create('daniel')
    expect(result.isSuccess).toBe(true)
  })
})
