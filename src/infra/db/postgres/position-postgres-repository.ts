import { position, PrismaClient } from '@prisma/client'
import { ICreatePositionRepository } from '../../../data/protocols/db/position/create-position'
import { ILoadPositionByIdRepository } from '../../../data/protocols/db/position/load-position-by-id'
import { ILoadPositionByNameRepository } from '../../../data/protocols/db/position/load-position-by-name'
import { IPositionModel } from '../../../domain/models/position'

export class PositionPostgresRepository
  implements
    ICreatePositionRepository,
    ILoadPositionByNameRepository,
    ILoadPositionByIdRepository
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

  async loadByName(
    name: string
  ): Promise<ILoadPositionByNameRepository.Result> {
    let register: position
    register = await this.prisma.position.findUnique({
      where: { name }
    })
    if (!register) {
      return null
    }
    return { id: register.id, positionName: register.name }
  }

  async loadById(id: string): Promise<ILoadPositionByIdRepository.Result> {
    let register: position
    register = await this.prisma.position.findUnique({ where: { id } })
    if (!register) {
      return null
    }
    return { id: register.id, positionName: register.name }
  }
}
