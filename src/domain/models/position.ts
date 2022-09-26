import { Result } from '../logic/result'
import { PositionName } from '../value-objects/position-name'

export interface PositionCreationProps {
  id: string
  positionName: PositionName
}

export class Position {
  private id: string
  private positionName: PositionName

  private constructor(props: PositionCreationProps) {
    this.id = props.id
    this.positionName = props.positionName
  }

  public static create(positionName: string, id: string): Result<Position> {
    const nameOrError = PositionName.create(positionName)
    if (nameOrError.isFailure) {
      return Result.fail(nameOrError.error)
    }
    const position = new Position({ positionName: nameOrError.getValue(), id })
    return Result.ok(position)
  }
}

export interface IPositionModel {
  id: string
  positionName: string
}
