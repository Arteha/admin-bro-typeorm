import "reflect-metadata"
import {createConnection, Connection} from "typeorm";

let connection: Connection

export async function connect () {
    connection = await createConnection()
}

export function close () {
    connection && connection.close()
}

export { connection }