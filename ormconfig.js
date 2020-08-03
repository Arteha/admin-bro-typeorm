module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: +(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DATABASE || 'database_test',
  entities: ['spec/entities/**/*.ts'],
  migrations: ['spec/migrations/**/*.ts'],
  subscribers: ['spec/subscribers/**/*.ts'],
  synchronize: true,
  logging: false,
  cli: {
    migrationsDir: 'spec/migrations',
    entitiesDir: 'spec/entities',
    subscribersDir: 'spec/subscribers',
  },
}
