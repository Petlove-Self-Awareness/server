import { PrismaClient, seniority } from '@prisma/client'
import { ILoadSenioritiesRepository } from '../../../data/protocols/db/seniority/load-seniorities-repository'
import { ILoadSeniorityByIdRepository } from '../../../data/protocols/db/seniority/load-seniority-by-id-repository'
import {
  ICreateSeniorityRepository,
  ILoadSeniorityByNameRepository,
  ISeniorityModel
} from '../../../data/usecases/seniority/create-seniority/db-create-seniority-protocols'

export class SeniorityPostgresRepository
  implements
    ICreateSeniorityRepository,
    ILoadSeniorityByNameRepository,
    ILoadSenioritiesRepository,
    ILoadSeniorityByIdRepository
{
  constructor(private readonly prisma: PrismaClient) {}
  async loadByName(name: string): Promise<ILoadSeniorityByNameRepository.Result> {
    let register: seniority
    register = await this.prisma.seniority.findUnique({ where: { name } })
    if (!register) return null
    return { id: register.id, seniorityName: register.name }
  }

  async create(seniorityData: ISeniorityModel): Promise<void> {
    await this.prisma.seniority.create({
      data: { id: seniorityData.id, name: seniorityData.seniorityName }
    })
  }

  async loadAll(): Promise<ILoadSenioritiesRepository.Result> {
    let register: seniority[]
    register = await this.prisma.seniority.findMany()
    if (register.length === 0) {
      return null
    }
    return register.map(seniority => ({
      id: seniority.id,
      seniorityName: seniority.name
    }))
  }

  async loadById(id: string): Promise<ILoadSeniorityByIdRepository.Result> {
    let register: seniority
    register = await this.prisma.seniority.findUnique({ where: { id } })
    if (!register) {
      return null
    }
    return { id: register.id, seniorityName: register.name }
  }
}
