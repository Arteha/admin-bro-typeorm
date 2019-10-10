import {Property} from "./Property";
import {BaseEntity, In, Repository} from "typeorm";
import {convertFilter} from "./utils/convertFilter";
const {BaseResource, BaseRecord, ValidationError} = require("admin-bro");

export const SEQUELIZE_VALIDATION_ERROR = "SequelizeValidationError";

export class Resource extends (BaseResource as any)
{
    private model: typeof BaseEntity;
    private propsObject: Record<string, Property> = {};
    private propsArray: Array<Property> = [];

    constructor(model: typeof BaseEntity)
    {
        super(model);

        this.model = model;
        this.prepareProps();
    }

    public databaseName(): string
    {
        return (this.model as any).usedConnection.options.type;
    }

    public databaseType(): string
    {
        return (this.model as any).usedConnection.options.type;
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
        return [...this.propsArray];
    }

    public property(path: string): Property
    {
        return this.propsObject[path];
    }

    public async count(filter)
    {
        return this.model.count(({
            where: convertFilter(filter),
        }));
    }

    public async populate(baseRecords, property: Property)
    {
        // TODO: populate
        return null;
        const ids: Array<any> = baseRecords.map(baseRecord =>
        {
            const propertyName = property.name();
            return baseRecord.param(propertyName);
        });
        const records = await this.model.find({where: {id: In(ids)}});
        const recordsHash = records.reduce((memo, record) =>
        {
            memo[(record as any).id] = record;
            return memo;
        }, {});
        baseRecords.forEach((baseRecord) =>
        {
            const id = baseRecord.params.id;
            if(recordsHash[id])
            {
                const referenceRecord = new BaseRecord(
                    recordsHash[id], this,
                );
                baseRecord.populated[property.name()] = referenceRecord;
            }
        });
        return baseRecords;
    }

    public async find(filter, {limit = 20, offset = 0, sort = {}})
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
        return instances.map(instance => new BaseRecord(instance, this));
    }

    public async findOne(id)
    {
        const sequelizeObject = await this.model.findOne(id);
        return new BaseRecord(sequelizeObject, this);
    }

    public async findById(id)
    {
        return await this.model.findOne(id);
    }

    public async create(params: any): Promise<any>
    {
        try
        {
            const instance = await this.model.create(params);
            await instance.save();
            return instance;
        }
        catch(error)
        {
            if(error.name === SEQUELIZE_VALIDATION_ERROR)
            {
                throw this.createValidationError(error);
            }
            throw error;
        }
    }

    public async update(pk, params: any = {})
    {
        try
        {
            const instance = await this.model.findOne(pk);
            if(instance)
            {
                for (const p in params)
                    instance[p] = params[p];

                await instance.save();
                return instance as any;
            }
            throw new Error("Instance not found.");
        }
        catch(error)
        {
            if(error.name === SEQUELIZE_VALIDATION_ERROR)
            {
                throw this.createValidationError(error);
            }
            throw error;
        }
    }

    public async delete(pk)
    {
        await this.model.delete(pk);
    }

    public createValidationError(originalError)
    {
        const errors = Object.keys(originalError.errors).reduce((memo, key) =>
        {
            const {path, message, validatorKey} = originalError.errors[key];
            memo[path] = {message, kind: validatorKey}; // eslint-disable-line no-param-reassign
            return memo;
        }, {});
        return new ValidationError(`${this.name()} validation failed`, errors);
    }

    private prepareProps()
    {
        const columns = this.model.getRepository().metadata.columns;
        for (const col of columns)
        {
            const property = new Property(col, this.id(), this.model);
            this.propsObject[col.propertyName] = property;
            this.propsArray.push(property);
        }
    }

    public static isAdapterFor(rawResource: any)
    {
        try
        {
            return rawResource.getRepository() instanceof Repository;
        }
        catch(e)
        {
        }

        return false;
    }
}
