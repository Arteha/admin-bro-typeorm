/* eslint-disable no-unused-expressions */
// eslint-disable-next-line import/no-extraneous-dependencies
import 'reflect-metadata'
import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: +(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || '',
  password: process.env.POSTGRES_PASSWORD || 'mysecretpassword',
  database: process.env.POSTGRES_DATABASE || 'database_test',
  entities: ['spec/entities/**/*.ts'],
  migrations: ['spec/migrations/**/*.ts'],
  subscribers: ['spec/subscribers/**/*.ts'],
  synchronize: true,
  logging: false,
})
