import { Resource } from "./Resource";
import { Connection, BaseEntity } from "typeorm";
import { BaseDatabase } from "admin-bro";

export class Database extends BaseDatabase
{
    public constructor(public readonly connection: Connection)
    {
        super(connection);
    }

    public resources(): Array<Resource>
    {
        const resources: Array<Resource> = [];
        for (const entityMetadata of this.connection.entityMetadatas)
            resources.push(new Resource(entityMetadata.target as typeof BaseEntity));

        return resources;
    }

    public static isAdapterFor(connection: any)
    {   
        return !!connection.entityMetadatas;
    }
}