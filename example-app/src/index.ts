import 'reflect-metadata'
import { createConnection } from 'typeorm'
import express from 'express'
import AdminBro from 'admin-bro'
import { buildRouter } from '@admin-bro/express'
import * as TypeormAdapter from '@admin-bro/typeorm'
import { User } from './entity/User'
import { Car } from './entity/Car'

AdminBro.registerAdapter(TypeormAdapter)

const PORT = 3000

const run = async () => {
  await createConnection()
  const app = express()
  const admin = new AdminBro({
    resources: [{
      resource: User,
      options: {
        properties: {
          firstName: {
            isTitle: true,
          },
        },
      },
    }, Car],
  })
  const router = buildRouter(admin)

  app.use(admin.options.rootPath, router)

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${PORT}`)
  })
}

run()
