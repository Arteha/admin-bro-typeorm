## admin-bro-typeorm

This is an inofficial [admin-bro](https://github.com/SoftwareBrothers/admin-bro) adapter which integrates [TypeORM](https://typeorm.io/) into admin-bro.

Installation: `npm install admin-bro-typeorm`

## Usage

The plugin can be registered using standard `AdminBro.registerAdapter` method.

```typescript
import { Database, Resource } from "admin-bro-typeorm";
import AdminBro from 'admin-bro'

AdminBro.registerAdapter({ Database, Resource });

// optional: if you use class-validator you have to inject this to resource.
import { validate } from 'class-validator'
Resource.validate = validate;
```

## Example

```typescript
import {
    BaseEntity,
    Entity, PrimaryGeneratedColumn, Column,
    createConnection,
    ManyToOne, OneToMany,
    RelationId
} from "typeorm";
import * as express from "express";
import { Database, Resource, UseAsTitle, UseForSearch } from "admin-bro-typeorm";
import { validate } from 'class-validator'

import AdminBro from "admin-bro";
import * as AdminBroExpress from "admin-bro-expressjs"

Resource.validate = validate;
AdminBro.registerAdapter({ Database, Resource });


@Entity({name: "Organizations"})
export class Organization extends BaseEntity
{
    @PrimaryGeneratedColumn()
    public id: number;
    
    @UseForSearch()
    @Column({type: 'varchar', unique: true})
    public govRegCode: string;
    
    @Column({type: 'varchar', unique: true})
    public name: string;
    
    @OneToMany(type => Person, person => person.organization)
    public employees?: Array<Person>;
    
    @UseAsTitle()
    public toString(): string
    {
        return `${this.firstName} ${this.lastName}`;
    }
}

@Entity({name: "Persons"})
export class Person extends BaseEntity
{
    @PrimaryGeneratedColumn()
    public id: number;
    
    @Column({type: 'varchar'})
    public firstName: string;
    
    @Column({type: 'varchar'})
    public lastName: string;

    @ManyToOne(type => Organization, org => org.employees)
    @JoinColumn({ name: "organizationId" })
    public organization?: Organization;

    // in order be able to fetch resources in admin-bro - we have to have id available
    @Column("int", { nullable: true })
    public organizationId: number | null;
    
    @UseAsTitle()
    public toString(): string
    {
        return `${this.firstName} ${this.lastName}`;
    }
}

( async () =>
{
    const connection = await createConnection({/* ... */});
    
    // Applying connection to model
    Organization.useConnection(connection);
    Person.useConnection(connection);
    
    const adminBro = new AdminBro({
        // databases: [connection],
        resources: [
            { resource: Organization, options: { parent: { name: "foobar" } } },
            { resource: Person, options: { parent: { name: "foobar" } } }
        ], 
        rootPath: '/admin',
    });
    
    const app = express();
    const router = AdminBroExpress.buildRouter(adminBro);
    app.use(adminBro.options.rootPath, router);
    app.listen(3000);
})();
```

## ManyToOne

Admin supports ManyToOne relationship but you also have to define @JoinColumn as stated in the example above.

## Warning

Typescript developers who want to use admin-bro of version `~1.3.0` - don't do this - use `^1.4.0` instead.