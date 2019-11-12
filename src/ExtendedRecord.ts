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
            // I Also patched "dots" to normal JSON. Because now we can edit json field like a string:
            /*
                {
                    "params": {
                    "id": 93,
                    "name": "4",
                    "carrierId": 1,
                    "countryId": 5,
                    "zeros": 3,
                    "zipCodes.0": 9,
                    "zipCodes.1": 12,
                    "zipCodes.2": 19,
                    "zipCodes.3": 22,
                    "zipCodes.4": 24,
                    "zipCodes.5.0": 33000,
                    "zipCodes.5.1": 34999,
                    "zipCodes.6.0": 39000,
                    "zipCodes.6.1": 40999,
                    "zipCodes.7": 42,
                    "zipCodes.8": 44,
                    "zipCodes.9": 47,
                    "zipCodes.10": 49,
                    "exceptions": [],
                    "carrier.id": 1,
                    "carrier.name": "leman",
                    "carrier.oilRate": 1.336,
                    "carrier.category": "all",
                    "carrier.hasSpecialHandling": true,
                    "country.id": 5,
                    "country.name": "SPAIN"
                    },
                    ...
               }
            * */
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