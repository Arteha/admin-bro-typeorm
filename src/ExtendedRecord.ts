import { BaseEntity } from "typeorm";
import { Resource } from "./Resource";

const {BaseRecord} = require("admin-bro");

const objectObject = ({}).toString();

export class ExtendedRecord extends (BaseRecord as any)
{
    private _title: string | null;

    constructor(instance: BaseEntity | null | undefined, resource: Resource)
    {
        super(instance, resource);

        if(instance)
        {
            const title = instance.toString();
            this._title = title != objectObject ? title : null;
        }
    }

    public title(): string
    {
        if(this._title != null)
            return this._title;
        else
            return super.title();
    }

    public toJSON(...args: any[]): Object
    {
        const obj = super.toJSON(args);
        obj.title = this.title();
        return obj;
    }

}