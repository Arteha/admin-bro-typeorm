## admin-bro-typeorm

This is an inofficial [admin-bro](https://github.com/SoftwareBrothers/admin-bro) adapter which integrates [TypeORM](https://typeorm.io/) into admin-bro.

Installation: `npm install admin-bro-typeorm`

## Usage

The plugin can be registered using standard `AdminBro.registerAdapter` method.

```typescript
import { Database, Resource } from "admin-bro-typeorm";
const AdminBro = require('admin-bro');

AdminBro.registerAdapter({ Database, Resource });
```

## Example

```typescript
import {
    BaseEntity,
    Entity, PrimaryGeneratedColumn, Column,
    createConnection
} from "typeorm";
import * as express from "express";
import { Database, Resource } from "admin-bro-typeorm";

const AdminBro = require("admin-bro");
const AdminBroExpress = require("admin-bro-expressjs");

AdminBro.registerAdapter({ Database, Resource });

@Entity()
export class Person extends BaseEntity
{
    @PrimaryGeneratedColumn()
    public id: number;
    
    @Column({type: 'varchar'})
    public firstName: string;
    
    @Column({type: 'varchar'})
    public lastName: string;
}

( async () =>
{
    const connection = await createConnection({/* ... */});
    
    // Applying connection to model
    Person.useConnection(connection);
    
    const adminBro = new AdminBro({
        // databases: [connection],
        resources: [
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

## Warning

Typescript developers who want to use admin-bro of version `~1.3.0` temporary avoid this construction till they fix it in the next versions.
```typescript
import { Database, Resource } from "admin-bro-typeorm";
import { default as AdminBro } from "admin-bro"; // WARNING: for now is better to use const & require

AdminBro.registerAdapter({ Database, Resource });
```
The reason of the problem is incorrect `*.d.ts` declarations for typings support. 

They export sources directly from `./src`, for example, not from `./dist` or `./lib` (compilation output).

You will have billion compilation errors kinda:

`node_modules/admin-bro/src/backend/utils/view-helpers.ts(91,5): error TS2322: Type 'string | undefined' is not assignable to type 'string'.`

So lets hope they'll fix it soon.