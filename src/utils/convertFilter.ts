import { BaseEntity, FindConditions, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { Filter } from "admin-bro";

function safeParseJSON(json: string)
{
    try
    {
        return JSON.parse(json);
    }
    catch(e)
    {
        return json;
    }
}

export function convertFilter(filter?: Filter): FindConditions<BaseEntity>
{
    if(!filter)
        return {};
    else
    {
        const {filters} = filter;
        const where = {};
        for (const n in filters)
        {
            const one = filters[n];
            if(["boolean", "number", "float", "mixed"].includes(one.property.type()))
                where[n] = safeParseJSON(one.value);
            else if(["date", "datetime"].includes(one.property.type()))
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
        return where;
    }
}
