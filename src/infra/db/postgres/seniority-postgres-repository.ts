import { position, PrismaClient } from '@prisma/client'
import {
  ICreateSeniorityRepository,
  ILoadSeniorityByNameRepository,
  ISeniorityModel
} from '../../../data/usecases/seniority/db-create-seniority-protocols'

export class SeniorityPostgresRepository
  implements ICreateSeniorityRepository, ILoadSeniorityByNameRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async loadByName(
    name: string
  ): Promise<ILoadSeniorityByNameRepository.Result> {
    let register: position
    register = await this.prisma.seniority.findUnique({ where: { name } })
    if (!register) return null
    return { id: register.id, seniorityName: register.name }
  }

  async create(seniorityData: ISeniorityModel): Promise<void> {
    await this.prisma.seniority.create({
      data: { id: seniorityData.id, name: seniorityData.seniorityName }
    })
  }
}
