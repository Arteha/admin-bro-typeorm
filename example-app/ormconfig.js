// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const rootDir = 'build/src'

module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: +(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DATABASE || 'database_test',
  entities: [path.join(rootDir, '/entity/**/*.js')],
  migrations: [path.join(rootDir, '/migration/**/*.js')],
  subscribers: [path.join(rootDir, '/subscriber/**/*.js')],
  synchronize: true,
  logging: true,
  cli: {
    migrationsDir: path.join(rootDir, '/migration'),
    entitiesDir: path.join(rootDir, '/entity'),
    subscribersDir: path.join(rootDir, '/subscriber'),
  },
}
