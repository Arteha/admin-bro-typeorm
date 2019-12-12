import "reflect-metadata";
import { SEARCH_FIELD_SYMBOL } from "../symbols/SEARCH_FIELD_SYMBOL";
import { BaseEntity } from "typeorm";

export function UseForSearch(name?: string)
{
    return function (target: BaseEntity, propertyKey: string | undefined): void
    {
        if (propertyKey == undefined)
            throw new TypeError();

        Reflect.defineMetadata(SEARCH_FIELD_SYMBOL, name || propertyKey, target.constructor);
    };
}