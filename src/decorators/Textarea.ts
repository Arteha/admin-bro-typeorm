import "reflect-metadata";
import { TEXTAREA_SYMBOL } from "../symbols/TEXTAREA_SYMBOL";
import { BaseEntity } from "typeorm";

export function Textarea(name?: string)
{
    return function (target: BaseEntity, propertyKey: string | undefined): void
    {
        if (propertyKey == undefined)
            throw new TypeError();

        Reflect.defineMetadata(TEXTAREA_SYMBOL, true, target.constructor, name || propertyKey);
    };
}