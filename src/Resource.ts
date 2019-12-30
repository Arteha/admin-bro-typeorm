import "reflect-metadata";
import { Property } from "./Property";
import { BaseEntity, In, Like } from "typeorm";
import { BaseResource, ValidationError, Filter, PropertyType } from "admin-bro";
import { ParamsType } from "admin-bro/types/src/backend/adapters/base-record";
import { convertFilter } from "./utils/convertFilter";
import { ExtendedRecord } from "./ExtendedRecord";
import { getTitle } from "./utils/getTitle";
import { SEARCH_FIELD_SYMBOL } from "./symbols/SEARCH_FIELD_SYMBOL";

export class Resource extends BaseResource
{
    public static validate: any;
    public model: typeof BaseEntity;
    private propsObject: Record<string, Property> = {};

    constructor(model: typeof BaseEntity)
    {
        super(model);

        this.model = model;
        this.prepareProps();
    }

    public databaseName(): string
    {
        return this.model.getRepository().metadata.connection.options.database as string || "typeorm";
    }

    public databaseType(): string
    {
        return this.model.getRepository().metadata.connection.options.type || "typeorm";
    }

    public name(): string
    {
        return this.model.getRepository().metadata.tableName;
    }

    public id()
    {
        return this.model.name;
    }

    public properties()
    {
        return Object.values(this.propsObject);
    }

    public property(path: string): Property | null
    {
        return this.propsObject[path] || null;
    }

    public async count(filter)
    {
        return this.model.count(({
            where: convertFilter(filter),
        }));
    }

    public async populate(baseRecords, property: Property)
    {
        const fks: Array<any> = baseRecords.map(baseRecord => baseRecord.params[property.name()]);

        const instances = await this.model.findByIds(fks);
        const instancesRecord: Record<string, BaseEntity> = {};
        for (const instance of instances)
        {
            if(instance.hasId())
                instancesRecord[(instance as any).id] = instance;
        }

        for (const baseRecord of baseRecords)
        {
            const fk = baseRecord.params[property.name()];
            const instance = instancesRecord[fk];
            if(instance)
            {
                const record = new ExtendedRecord(instance, this);
                record.setTitle(await getTitle(instance));
                baseRecord.populated[property.name()] = record;
            }
        }

        return baseRecords;
    }

    public async find(filter: Filter, {limit = 10, offset = 0, sort = {}}): Promise<Array<ExtendedRecord>>
    {
        const {direction, sortBy} = sort as any;
        const instances = await this.model.find({
            where: convertFilter(filter),
            take: limit,
            skip: offset,
            order: {
                [sortBy]: (direction || "asc").toUpperCase()
            }
        });

        const records: Array<ExtendedRecord> = [];
        for (const instance of instances)
        {
            const record = new ExtendedRecord(instance, this);
            record.setTitle(await getTitle(instance));
            records.push(record);
        }

        return records;
    }

    public async findMany(ids: Array<string>): Promise<Array<ExtendedRecord>>
    {
        const instances = await this.model.find({ where: { id: In(ids) } });
        const records: Array<ExtendedRecord> = [];
        for (const instance of instances)
        {
            const record = new ExtendedRecord(instance, this);
            record.setTitle(await getTitle(instance));
            records.push(record);
        }

        return records;
  }

    public async search(value: any, limit: number = 50): Promise<Array<ExtendedRecord>>
    {
        const meta = Reflect.getMetadata(SEARCH_FIELD_SYMBOL, this.model);

        let kt: {key: string, type: PropertyType} | null = null;
        if(meta)
        {
            const key = `${meta}`;
            const prop = this.property(key);
            if(prop != null)
                kt = {key, type: prop.type()};
        }
        else
        {
            const nameProp = this.property("name");
            const idProp = this.property("id");
            if(nameProp)
                kt = {key: "name", type: nameProp.type()};
            else if(idProp)
                kt = {key: "id", type: idProp.type()};
        }

        if(kt != null)
        {
            const instances = await this.model.find({
                where: {[kt.key]: kt.type == "string" ? Like(`%${value}%`) : value},
                take: limit
            });

            const records: Array<ExtendedRecord> = [];
            for (const instance of instances)
            {
                const record = new ExtendedRecord(instance, this);
                record.setTitle(await getTitle(instance));
                records.push(record);
            }

            return records;
        }

        throw new Error("Search field not found.");
    }

    public async findOne(id)
    {
        const instance = await this.model.findOne(id);
        const record = new ExtendedRecord(instance, this);
        record.setTitle(await getTitle(instance));
        return record;
    }

    public async findById(id)
    {
        return await this.model.findOne(id);
    }

    public async create(params: any): Promise<ParamsType>
    {
        const instance = await this.model.create(this.prepareParamsBeforeSave(params));

        await this.validateAndSave(instance);

        return instance;
    }

    public async update(pk, params: any = {}): Promise<ParamsType>
    {
        params = this.prepareParamsBeforeSave(params);
        const instance = await this.model.findOne(pk);
        if(instance)
        {
            for(const p in params)
                instance[p] = params[p];
            await this.validate(instance);
            await instance.save();
            return instance;
        }

        throw new Error("Instance not found.");
    }

    public async delete(pk)
    {
        await this.model.delete(pk);
    }

    private prepareProps()
    {
        const columns = this.model.getRepository().metadata.columns;
        for (let i = 0; i < columns.length; i++)
        {
            const property = new Property(columns[i], this, i);
            this.propsObject[property.path()] = property;
        }
    }

    private prepareParamsBeforeSave(params: Object): Object
    {
        for (const p in params)
        {
            const property = this.property(p);
            if(property)
            {
                if(["mixed", "boolean"].includes(property.type()))
                    params[p] = !params[p] ? null : JSON.parse(params[p]);
                else if(["number", "float"].includes(property.type()))
                    params[p] = !params[p] ? null : Number(params[p]);
                else if(["date", "datetime"].includes(property.type()))
                    params[p] = !params[p] ? null : new Date(params[p]);
                else if(property.type() == "reference")
                    params[property.column.propertyName] = !params[p] ? null : +params[p];
            }
        }
        return params;
    }

    private async validate(instance: BaseEntity)
    {
        if(Resource.validate)
        {
            const errors = await Resource.validate(instance);
            if(errors && errors.length)
            {
                const validationErrors = errors.reduce((memo, error) => ({
                    ...memo,
                    [error.property]: {
                        type: Object.keys(error.constraints)[0],
                        message: Object.values(error.constraints)[0],
                    }
                }), {});
                throw new ValidationError(`${this.name()} validation failed`, validationErrors);
            }
        }
    }

    private async validateAndSave(instance: BaseEntity)
    {
        await this.validate(instance);

        try
        {
            await instance.save();
        }
        catch(error)
        {
            if(error.name === "QueryFailedError")
            {
                throw new ValidationError(`${this.name()} validation failed`, {
                    [error.column]: {
                        type: "schema error",
                        message: error.message
                    }
                });
            }
        }
    }

    public static isAdapterFor(rawResource: any)
    {
        try
        {
            return !!rawResource.getRepository().metadata;
        }
        catch(e)
        {
            return false;
        }
    }
}
