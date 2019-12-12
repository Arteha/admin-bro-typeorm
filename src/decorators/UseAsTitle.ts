import "reflect-metadata";
import { TITLE_SYMBOL } from "../symbols/TITLE_SYMBOL";
import { BaseEntity } from "typeorm";

export function UseAsTitle(name?: string)
{
    return function (target: BaseEntity, propertyKey: string | undefined): void
    {
        if (propertyKey == undefined)
            throw new TypeError();

        Reflect.defineMetadata(TITLE_SYMBOL, name || propertyKey, target.constructor);
    };
}