## admin-bro-typeorm

This is an official [admin-bro](https://github.com/SoftwareBrothers/admin-bro) adapter which integrates [TypeORM](https://typeorm.io/) into admin-bro. (originally forked from [Arteha/admin-bro-typeorm](https://github.com/Arteha/admin-bro-typeorm))

Installation: `yarn add @admin-bro/typeorm`

## Usage

The plugin can be registered using standard `AdminBro.registerAdapter` method.
o
```typescript
import { Database, Resource } from '@admin-bro/typeorm'
import AdminBro from 'admin-bro'

AdminBro.registerAdapter({ Database, Resource });

// optional: if you use class-validator you have to inject this to resource.
import { validate } from 'class-validator'
Resource.validate = validate
```

## Example

```typescript
import {
    BaseEntity,
    Entity, PrimaryGeneratedColumn, Column,
    createConnection,
    ManyToOne,
    RelationId
} from 'typeorm'
import * as express from 'express'
import { Database, Resource } from '@admin-bro/typeorm'
import { validate } from 'class-validator'

import AdminBro from 'admin-bro'
import * as AdminBroExpress from '@admin-bro/express'

Resource.validate = validate
AdminBro.registerAdapter({ Database, Resource })

@Entity()
export class Person extends BaseEntity
{
    @PrimaryGeneratedColumn()
    public id: number;
    
    @Column({type: 'varchar'})
    public firstName: string;
    
    @Column({type: 'varchar'})
    public lastName: string;

    @ManyToOne(type => CarDealer, carDealer => carDealer.cars)
    organization: Organization;

    // in order be able to fetch resources in admin-bro - we have to have id available
    @RelationId((person: Person) => person.organization)
    organizationId: number;
    
    // For fancy clickable relation links:
    public toString(): string
    {
        return `${firstName} ${lastName}`;
    }
}

( async () =>
{
    const connection = await createConnection({/* ... */})
    
    // Applying connection to model
    Person.useConnection(connection)
    
    const adminBro = new AdminBro({
        // databases: [connection],
        resources: [
            { resource: Person, options: { parent: { name: 'foobar' } } }
        ], 
        rootPath: '/admin',
    })
    
    const app = express()
    const router = AdminBroExpress.buildRouter(adminBro)
    app.use(adminBro.options.rootPath, router)
    app.listen(3000)
})()
```

## ManyToOne

Admin supports ManyToOne relationship but you also have to define @RealationId as stated in the example above.

## Contribution

### Running the example app

If you want to set this up locally this is the suggested process:

1. fork the repo
2. Install dependencies

```
yarn install
```

3. register this package as a (linked package)[https://classic.yarnpkg.com/en/docs/cli/link/]

```
yarn link
```

4. Setup example app

Install all dependencies and use previously linked version of `@admin-bro/typeorm`.

```
cd example-app
yarn install
yarn link @admin-bro/typeorm
```

Optionally you might want to link your local version of `admin-bro` package

5. Make sure you have all the envs set (which are defined in `example-app/ormconfig.js`)

6. Build the package in watch mode

(in the root folder)

```
yarn dev
```

6. run the app in the dev mode

```
cd example-app
yarn dev
```

### Pull request

Before you make a PR make sure all tests pass and your code wont causes linter errors.
You can do this by running:

```
yarn lint
yarn test
```

or with proper envs: `POSTGRES_USER=yourtestuser POSTGRES_DATABASE="database_test" yarn test`