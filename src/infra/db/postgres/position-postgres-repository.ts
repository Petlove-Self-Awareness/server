import { position, PrismaClient } from '@prisma/client'
import { ICreatePositionRepository } from '../../../data/protocols/db/position/create-position'
import { ILoadPositionByNameRepository } from '../../../data/protocols/db/position/load-position-by-name'
import { IPositionModel } from '../../../domain/models/position'

export class PositionPostgresRepository
  implements ICreatePositionRepository, ILoadPositionByNameRepository
{
  constructor(private readonly prisma: PrismaClient) {}
  async create(positionData: IPositionModel): Promise<void> {
    await this.prisma.position.create({
      data: {
        id: positionData.id,
        name: positionData.positionName
      }
    })
  }

  async load(name: string): Promise<ILoadPositionByNameRepository.Result> {
    let register: position
    register = await this.prisma.position.findUnique({
      where: { name }
    })
    if (!register) {
      return null
    }
    return { id: register.id, positionName: register.name }
  }
}
