import { BaseEntity } from "typeorm";
import { TITLE_SYMBOL } from "../symbols/TITLE_SYMBOL";

export async function getTitle(instance: BaseEntity | null | undefined): Promise<string>
{
    if(instance)
    {
        const meta = Reflect.getMetadata(TITLE_SYMBOL, instance.constructor);
        if(meta)
        {
            const prop = instance[meta];
            if(prop instanceof Function)
                return `${await (prop.bind(instance))()}`;
            else if(prop instanceof Promise)
                return `${await prop}`;
            return `${prop}`;
        }
        else
        {
            if(instance.hasOwnProperty("name"))
                return `${(instance as any).name}`;
            else if(instance.hasOwnProperty("id"))
                return `${(instance as any).id}`;
            else
            {
                for (const k in instance)
                    return instance[k];
            }
        }
    }

    return "";
}