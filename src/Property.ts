import "reflect-metadata";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { DATA_TYPES } from "./utils/data-types";
import { BaseProperty, PropertyType } from "admin-bro";
import {Resource} from "./Resource";
import {TEXTAREA_SYMBOL} from "./symbols/TEXTAREA_SYMBOL";
import { SEARCH_FIELD_SYMBOL } from "./symbols/SEARCH_FIELD_SYMBOL";

export class Property extends BaseProperty
{
    public column: ColumnMetadata;
    public resource: Resource;
    public columnPosition: number;

    constructor(column: ColumnMetadata, resource: Resource, columnPosition: number)
    {
        // for reference fields take database name (with ...Id)
        const path = column.referencedColumn ? column.databaseName : column.propertyPath;
        super({ path });
        this.column = column;
        this.resource = resource;
        this.columnPosition = columnPosition;
    }

    public name()
    {
        return this.column.propertyName;
    }

    public isTitle(): boolean
    {
        const name = this.name();
        const key = Reflect.getMetadata(SEARCH_FIELD_SYMBOL, this.resource.model);
        if(key != undefined)
            return key == this.name();
        else
        {
            const firstProp = this.resource.properties()[0];
            if(firstProp)
                return firstProp.name() == name;
            return false;
        }
    }

    public isEditable()
    {
        return !this.isId()
            && !this.column.isCreateDate
            && !this.column.isUpdateDate;
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

    public position() {
        return this.columnPosition || 0;
    }

    public availableValues()
    {
        const values = this.column.enum;
        if (values)
            return values.map(val => val.toString());
        return null;
    }

    public type(): PropertyType
    {

        let type: PropertyType | null = null;
        if (typeof this.column.type == "function")
        {
            if (this.column.type == Number)
                type = "number";
            else if (this.column.type == String)
                type = "string";
            else if (this.column.type == Date)
                type = "datetime";
            else if (this.column.type == Boolean)
                type = "boolean";
        }
        else
            type = DATA_TYPES[ this.column.type as any ];

        if (this.reference())
            return "reference";

        if (!type)
            console.warn(`Unhandled type: ${this.column.type}`);

        type = type || "string";

        if(type == "string" && Reflect.getMetadata(TEXTAREA_SYMBOL, this.resource.model, this.name()))
            return "textarea";
        // TODO: Uncomment this in future.
        /*if(Reflect.getMetadata(TEXTAREA_SYMBOL, this.resource.model, this.name()))
            return "textarea";*/

        return type;
    }
}