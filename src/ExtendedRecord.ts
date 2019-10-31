import { BaseEntity } from "typeorm";
import { Resource } from "./Resource";

const { BaseRecord } = require("admin-bro");

const objectObject = ({}).toString();

export class ExtendedRecord extends (BaseRecord as any)
{
    private _title: string | null;
    private patchedParams: Object = {};

    constructor(instance: BaseEntity | null | undefined, resource: Resource)
    {
        super(instance, resource);

        if (instance)
        {
            for (const n in instance)
            {
                const value = instance[ n ];
                if (value instanceof Object && !(value instanceof Date))
                    this.patchedParams[ n ] = JSON.stringify(value);
            }

            const title = instance.toString();
            this._title = title != objectObject ? title : null;
        }
    }

    public title(): string
    {
        if (this._title != null)
            return this._title;
        else
            return super.title();
    }

    public toJSON(...args: any[]): Object
    {
        const obj = super.toJSON(args);
        for(let p in this.patchedParams)
            obj.params[p] = this.patchedParams[p];
        obj.title = this.title();
        return obj;
    }

}