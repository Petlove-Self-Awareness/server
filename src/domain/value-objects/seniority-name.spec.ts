import { SeniorityName } from './seniority-name'

describe('SeniorityName value object', () => {
  test('Should return fail if name is falsy', () => {
    const result = SeniorityName.create('')
    expect(result.isFailure).toBe(true)
  })

  test('Should return fail if name is shorter than 4 characters', () => {
    const result = SeniorityName.create('abc')
    expect(result.isFailure).toBe(true)
  })

  test('Should return fail if name is longer than 20 characters', () => {
    const result = SeniorityName.create('aaaaaaaaaaaaaaaaaaaaa')
    expect(result.isFailure).toBe(true)
  })

  test('Should create name with no white spaces in edges', () => {
    const result = SeniorityName.create(' senior ')
    expect(result.getValue().value).toBe('senior')
  })

  test('Should return an PositionName if name passes validations', () => {
    const result = SeniorityName.create('senior')
    expect(result.isSuccess).toBe(true)
  })
})
