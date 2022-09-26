import { PositionName } from './position-name'

describe('PositionName value object', () => {
  test('Should return fail if name is falsy', () => {
    const result = PositionName.create('')
    expect(result.isFailure).toBe(true)
  })

  test('Should return fail if name is shorter than 3 characters', () => {
    const result = PositionName.create('ab')
    expect(result.isFailure).toBe(true)
  })

  test('Should return fail if name is longer than 30 characters', () => {
    const result = PositionName.create('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    expect(result.isFailure).toBe(true)
  })

  test('Should create name with no white spaces in edges', () => {
    const result = PositionName.create(' engineer ')
    expect(result.getValue().value).toBe('engineer')
  })

  test('Should return fail if a name contains a number', () => {
    const result = PositionName.create('engineer12')
    expect(result.isFailure).toBe(true)
  })

  test('Should return an PositionName if name passes validations', () => {
    const result = PositionName.create('engineer')
    expect(result.isSuccess).toBe(true)
  })
})
