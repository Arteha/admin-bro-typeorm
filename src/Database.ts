import { Connection, BaseEntity } from 'typeorm'

import { BaseDatabase } from 'adminjs'
import { Resource } from './Resource'

export class Database extends BaseDatabase {
  public constructor(public readonly connection: Connection) {
    super(connection)
  }

  public resources(): Array<Resource> {
    const resources: Array<Resource> = []
    // eslint-disable-next-line no-restricted-syntax
    for (const entityMetadata of this.connection.entityMetadatas) {
      resources.push(new Resource(entityMetadata.target as typeof BaseEntity))
    }

    return resources
  }

  public static isAdapterFor(connection: any): boolean {
    return !!connection.entityMetadatas
  }
}
