import { BaseEntity } from "typeorm";
import { Resource } from "./Resource";

import { BaseRecord, RecordJSON, CurrentAdmin } from "admin-bro";

const objectObject = ({}).toString();

export class ExtendedRecord extends BaseRecord
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

    public toJSON(currentAdmin?: CurrentAdmin): RecordJSON
    {
        const obj = super.toJSON(currentAdmin);
        for(let p in this.patchedParams)
            obj.params[p] = this.patchedParams[p];
        obj.title = this.title();
        return obj;
    }

}