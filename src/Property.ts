import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { BaseEntity } from "typeorm";
import { DATA_TYPES, DataType } from "./utils/data-types";

const { BaseProperty } = require("admin-bro");

export class Property extends (BaseProperty as any)
{
    public model: typeof BaseEntity;
    public column: ColumnMetadata;

    constructor(column: ColumnMetadata, path: string, model: typeof BaseEntity)
    {
        super({ path: path });
        this.column = column;
        this.model = model;
    }

    public name()
    {
        return this.column.propertyName;
    }

    public isEditable()
    {
        return true;
    }

    public isVisible()
    {
        // fields containing password are hidden by default
        return !this.name().toLowerCase().includes("password");
    }

    public isId()
    {
        return this.column.isPrimary;
    }

    public reference(): string | null
    {
        const ref = this.column.referencedColumn;
        if (ref)
            return ref.entityMetadata.name;
        else
            return null;
    }

    public availableValues()
    {
        const values = this.column.enum;
        if (values)
            return values.map(val => val.toString());
        return null;
    }

    public type(): any
    {
        let type: DataType | null = null;
        if (typeof this.column.type == "function")
        {
            if (this.column.type == Number)
                type = "number";
        }
        else
            type = DATA_TYPES[ this.column.type as any ];

        if (this.reference())
            return "reference";

        if (!type)
            console.warn(`Unhandled type: ${this.column.type}`);

        return type || "string";
    }
}