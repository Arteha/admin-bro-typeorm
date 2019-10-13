import { Resource } from "./Resource";
import { Connection } from "typeorm";

const { BaseDatabase } = require("admin-bro");

export class Database extends (BaseDatabase as any)
{
    public constructor(public readonly connection: Connection)
    {
        super(connection);
    }

    public resources(): any
    {
        const resources: Array<Resource> = [];

        for (const entityMetadata of this.connection.entityMetadatas)
            resources.push(new Resource(entityMetadata.target as any) as any);

        return resources;
    }

    public static isAdapterFor(database: any)
    {
        return database instanceof Connection;
    }
}