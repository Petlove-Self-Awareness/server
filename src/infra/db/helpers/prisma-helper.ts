import { PrismaClient } from '@prisma/client'

export const PrismaHelper = {
  client: null as PrismaClient,

  async connect(): Promise<void> {
    if (!this.client) {
      this.client = new PrismaClient()
      await this.client.$connect()
      console.log('Postgres connected!')
    }
  },

  async disconnect(): Promise<void> {
    if (this.client !== null) {
      await this.client.$disconnect()
      this.client = null
      console.log('Postgres disconected')
    }
  }
}
