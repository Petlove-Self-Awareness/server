import { position, PrismaClient } from '@prisma/client'
import { ICreatePositionRepository } from '../../../data/protocols/db/position/create-position'
import { IDeletePositionRepository } from '../../../data/protocols/db/position/delete-position'
import { ILoadPositionByIdRepository } from '../../../data/protocols/db/position/load-position-by-id'
import { ILoadPositionByNameRepository } from '../../../data/protocols/db/position/load-position-by-name'
import { ILoadPositionsRepository } from '../../../data/protocols/db/position/load-positions'
import { ISavePositionRepository } from '../../../data/protocols/db/position/save-position'
import { IPositionModel } from '../../../domain/models/position'

export class PositionPostgresRepository
  implements
    ICreatePositionRepository,
    ILoadPositionByNameRepository,
    ILoadPositionByIdRepository,
    ILoadPositionsRepository,
    IDeletePositionRepository,
    ISavePositionRepository
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

  async loadByName(name: string): Promise<ILoadPositionByNameRepository.Result> {
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

  async loadAll(): Promise<ILoadPositionsRepository.Result> {
    let register: position[]
    register = await this.prisma.position.findMany()
    if (register.length === 0) {
      return null
    }
    return register.map(position => ({
      id: position.id,
      positionName: position.name
    }))
  }

  async delete(id: string): Promise<IDeletePositionRepository.Result> {
    const result = await this.loadById(id)
    if (!result) {
      return null
    }
    await this.prisma.position.delete({ where: { id } })
  }

  async save(
    data: ISavePositionRepository.Params
  ): Promise<ISavePositionRepository.Result> {
    const register = await this.loadById(data.id)
    if (register) return null
    await this.prisma.position.update({
      where: { id: data.id },
      data: { name: data.positionName }
    })
  }
}
