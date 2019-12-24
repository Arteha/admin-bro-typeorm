import { BaseEntity, FindConditions, Between, MoreThanOrEqual, LessThanOrEqual, Like } from "typeorm";
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
            if(["number", "float", "reference"].includes(one.property.type()))
            {
                const val = Number(one.value);
                if(!isNaN(val))
                    where[n] = val;
            }
            else if(["boolean", "mixed"].includes(one.property.type()))
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
                where[n] = Like(`%${one.value}%`);
        }
        return where;
    }
}
