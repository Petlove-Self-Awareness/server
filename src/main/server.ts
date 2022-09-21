import { PrismaHelper } from '../infra/db/helpers/prisma-helper'

const port = process.env.PORT || 3000

PrismaHelper.connect()
  .then(async () => {
    const app = await (await import('./config/app')).default
    app.listen(port, () => {
      console.log(`App running on http://localhost:${port}`)
    })
  })
  .catch(console.error)
