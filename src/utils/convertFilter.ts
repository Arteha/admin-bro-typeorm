import { BaseEntity, FindConditions, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { Resource } from "../Resource";
import { Property } from "../Property";

type Filter = { path: string, property: Property, value: any };
type Filters = Record<string, Filter>;

export function convertFilter(filter?: { resource: Resource, filters: Filters }): FindConditions<BaseEntity>
{
    if (!filter)
        return {};
    else
    {
        const {filters} = filter;
        const where = {};
        for(const n in filters)
        {
            const one = filters[n];
            console.log(one.value);
            if(["boolean", "number", "float", "object", "array"].includes(one.property.type()))
                where[n] = JSON.parse(one.value);
            if(["date", "datetime"].includes(one.property.type()))
            {
                if(one.value.from && one.value.to)
                    where[n] = Between(new Date(one.value.from), new Date(one.value.to));
                else if(one.value.from)
                    where[n] = MoreThanOrEqual(new Date(one.value.from));
                else if(one.value.to)
                    where[n] = LessThanOrEqual(new Date(one.value.to));
            }
            else
                where[n] = one.value;
        }
        console.log(where);
        return where;
    }
}
