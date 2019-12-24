import { BaseRecord, CurrentAdmin } from "admin-bro";
import RecordJSON from "admin-bro/types/src/backend/decorators/record-json.interface";
import { BaseEntity } from "typeorm";
import { Resource } from "./Resource";

export class ExtendedRecord extends BaseRecord
{
    private _instance: BaseEntity | null = null;
    private _customTitle: string | null = null;

    constructor(instance: BaseEntity | null | undefined, resource: Resource)
    {
        super(instance, resource);

        if(instance)
            this._instance = instance;
    }

    public setTitle(value: string): void
    {
        this._customTitle = value;
    }

    public title(): string
    {
        if(this._customTitle != null)
            return this._customTitle;

        return super.title() || "";
    }

    public toJSON(currentAdmin?: CurrentAdmin): RecordJSON
    {
        const obj = super.toJSON(currentAdmin);
        obj.title = this.title(); // sorry but, .toJSON() doesn't take title from .title()
        if(this._instance)
        {
            // patched strange objects ({"key.deepKey": 123}) to normal JSON.
            obj.params = {};
            for (const n in this._instance)
            {
                const value = this._instance[n];
                const property = this.resource.property(n);
                if(property)
                {
                    const type = property.type();
                    if(type == "mixed")
                        obj.params[n] = JSON.stringify(value);
                    else
                        obj.params[n] = value;
                }
            }
        }

        return obj;
    }
}