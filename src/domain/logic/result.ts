export class Result<T> {
  public isSuccess: boolean
  public isFailure: boolean
  public error: string
  private _value: T

  private constructor(isSuccess: boolean, error?: string, value?: T) {
    if (isSuccess && error) {
      throw new Error(
        'Invalid Operation: A result cannot be successful and contain an error!'
      )
    }
    if (!isSuccess && !error) {
      throw new Error(
        'Invalid Operation: A failing result must contain an error message!'
      )
    }

    this.isSuccess = isSuccess
    this.isFailure = !isSuccess
    this.error = error
    this._value = value

    Object.freeze(this)
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error("Can't retrieve the value from a failed result")
    }
    return this._value
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value)
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error)
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (let result of results) {
      if (result.isFailure) {
        return result
      }
    }
    return Result.ok<any>()
  }
}
