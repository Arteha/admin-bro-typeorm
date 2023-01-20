## adminjs-typeorm

This is an official [AdminJS](https://github.com/SoftwareBrothers/adminjs) adapter which integrates [TypeORM](https://typeorm.io/) into AdminJS. (originally forked from [Arteha/admin-bro-typeorm](https://github.com/Arteha/admin-bro-typeorm))

Installation: `yarn add @adminjs/typeorm`

## Usage

The plugin can be registered using standard `AdminJS.registerAdapter` method.

```typescript
import { Database, Resource } from '@adminjs/typeorm'
import AdminJS from 'adminjs'

AdminJS.registerAdapter({ Database, Resource });

// Optional: if you use class-validator you have to inject this to resource.
import { validate } from 'class-validator'
Resource.validate = validate
```

## Example

```typescript
import {
  BaseEntity,
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne,
  RelationId
} from 'typeorm'
import { MyDataSource } from './my-data-source'
import * as express from 'express'
import { Database, Resource } from '@adminjs/typeorm'
import { validate } from 'class-validator'

import AdminJS from 'adminjs'
import * as AdminJSExpress from '@adminjs/express'

Resource.validate = validate
AdminJS.registerAdapter({ Database, Resource })

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

  // in order be able to fetch resources in adminjs - we have to have id available
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
  await MyDataSource.initialize();

  const adminJs = new AdminJS({
    // databases: [MyDataSource],
    resources: [
      { resource: Person, options: { parent: { name: 'foobar' } } }
      ],
    rootPath: '/admin',
  })

  const app = express()
  const router = AdminJSExpress.buildRouter(adminJs)
  app.use(adminJs.options.rootPath, router)
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

Install all dependencies and use previously linked version of `@adminjs/typeorm`.

```
cd example-app
yarn install
yarn link @adminjs/typeorm
```

Optionally you might want to link your local version of `adminjs` package

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

## License

AdminJS is copyrighted © 2023 rst.software. It is a free software, and may be redistributed under the terms specified in the [LICENSE](LICENSE.md) file.

## About rst.software

<img src="https://pbs.twimg.com/profile_images/1367119173604810752/dKVlj1YY_400x400.jpg" width=150>

We’re an open, friendly team that helps clients from all over the world to transform their businesses and create astonishing products.

* We are available for [hire](https://www.rst.software/estimate-your-project).
* If you want to work for us - check out the [career page](https://www.rst.software/join-us).
