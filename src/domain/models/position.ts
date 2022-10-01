import { Result } from '../logic/result'
import { PositionName } from '../value-objects/position-name'

export interface PositionCreationProps {
  id: string
  positionName: PositionName
}

export class Position {
  private id: string
  private positionName: PositionName

  get name(): PositionName {
    return this.positionName
  }

  set updateName(name: PositionName) {
    this.positionName = name
  }

  get positionId(): string {
    return this.id
  }

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

  public convertToModel(): IPositionModel {
    return { id: this.id, positionName: this.positionName.value }
  }
}

export interface IPositionModel {
  id: string
  positionName: string
}
