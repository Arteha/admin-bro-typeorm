import 'reflect-metadata'
import { createConnection } from 'typeorm'
import express from 'express'
import AdminJS from 'adminjs'
import { buildRouter } from '@adminjs/express'
import * as TypeormAdapter from '@adminjs/typeorm'
import { User } from './entity/User'
import { Car } from './entity/Car'
import { Seller } from './entity/Seller'

AdminJS.registerAdapter(TypeormAdapter)

const PORT = 3000

const run = async () => {
  await createConnection()
  const app = express()
  const admin = new AdminJS({
    resources: [{
      resource: User,
      options: {
        properties: {
          firstName: {
            isTitle: true,
          },
        },
      },
    }, {
      resource: Car,
      options: {
        properties: {
          'meta.title': {
            type: 'string',
          },
          'meta.description': {
            type: 'string',
          },
        },
      },
    }, Seller],
  })
  const router = buildRouter(admin)

  app.use(admin.options.rootPath, router)

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${PORT}`)
  })
}

run()
