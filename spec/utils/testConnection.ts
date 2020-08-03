/* eslint-disable no-unused-expressions */
// eslint-disable-next-line import/no-extraneous-dependencies
import 'reflect-metadata'
import { createConnection, Connection } from 'typeorm'

// eslint-disable-next-line import/no-mutable-exports
let connection: Connection

export async function connect(): Promise<void> {
  connection = await createConnection()
}

export function close(): void {
  connection && connection.close()
}

export { connection }
