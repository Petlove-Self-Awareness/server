import { Result } from '../logic/result'
import { SeniorityName } from '../value-objects/seniority-name'

export interface SeniorityCreationProps {
  id: string
  seniorityName: SeniorityName
}

export class Seniority {
  private id: string
  private seniorityName: SeniorityName

  get name(): SeniorityName {
    return this.seniorityName
  }

  get seniorityId(): string {
    return this.id
  }

  private constructor(props: SeniorityCreationProps) {
    this.id = props.id
    this.seniorityName = props.seniorityName
  }

  public static create(seniorityName: string, id: string): Result<Seniority> {
    const nameOrError = SeniorityName.create(seniorityName)
    if (nameOrError.isFailure) {
      return Result.fail(nameOrError.error)
    }
    const seniority = new Seniority({
      id,
      seniorityName: nameOrError.getValue()
    })
    return Result.ok<Seniority>(seniority)
  }
}

export interface ISeniorityModel {
  id: string
  seniorityName: string
}
