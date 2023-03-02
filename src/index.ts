/**
 * @module @adminjs/typeorm
 * @subcategory Adapters
 * @section modules
 *
 * @classdesc
 * Database adapter which integrates [TypeORM](https://typeorm.io/) into adminjs
 *
 * ## installation
 *
 * ```
 * yarn add @adminjs/typeorm
 * ```
 *
 * ## Usage
 *
 * The plugin can be registered using standard `AdminJS.registerAdapter` method.
 *
 * ```
 * import { Database, Resource } from '@adminjs/typeorm';
 * import AdminJS from 'adminjs'
 *
 * AdminJS.registerAdapter(TypeOrmAdapter);
 *
 * //...
 * ```
 *
 * if you use class-validator you have to inject this to resource:
 *
 * ```
 * import { validate } from 'class-validator'
 *
 * //...
 * Resource.validate = validate;
 * ```
 *
 * ## Example
 *
 * Let see the entire working example of one file typeorm application running on express server:
 *
 * ```
 * import {
 *     BaseEntity,
 *     Entity, PrimaryGeneratedColumn, Column,
 *     createConnection,
 *     ManyToOne,
 *     RelationId
 * } from 'typeorm';
 * import * as express from 'express';
 * import { Database, Resource } from '@adminjs/typeorm';
 * import { validate } from 'class-validator'
 *
 * import AdminJS from 'adminjs';
 * import * as AdminJSExpress from '@adminjs/express'
 *
 * Resource.validate = validate;
 * AdminJS.registerAdapter({ Database, Resource });
 *
 * \@Entity()
 * export class Person extends BaseEntity
 * {
 *     \@PrimaryGeneratedColumn()
 *     public id: number;
 *
 *     \@Column({type: 'varchar'})
 *     public firstName: string;
 *
 *     \@Column({type: 'varchar'})
 *     public lastName: string;
 *
 *     \@ManyToOne(type => CarDealer, carDealer => carDealer.cars)
 *     organization: Organization;
 *
 *     // in order be able to fetch resources in adminjs - we have to have id available
 *     \@RelationId((person: Person) => person.organization)
 *     organizationId: number;
 * }
 *
 * ( async () =>
 * {
 *     const connection = await createConnection({...});
 *
 *     // Applying connection to model
 *     Person.useConnection(connection);
 *
 *     const adminJs = new AdminJS({
 *         // databases: [connection],
 *         resources: [
 *             { resource: Person, options: { parent: { name: 'foobar' } } }
 *         ],
 *         rootPath: '/admin',
 *     });
 *
 *     const app = express();
 *     const router = AdminJSExpress.buildRouter(adminJs);
 *     app.use(adminJs.options.rootPath, router);
 *     app.listen(3000);
 * })();
 * ```
 *
 * ## ManyToOne
 *
 * Admin supports ManyToOne relationship but you also have to define @RealationId
 * as stated in the example above.
 *
 * So 2 properties are needed:
 *
 * ```
 * \@ManyToOne(type => CarDealer, carDealer => carDealer.cars)
 * organization: Organization;
 * ```
 *
 * and, because TypeORM doesn't publish raw IDs of references, the relation id is also needed:
 *
 * ```
 * \@RelationId((person: Person) => person.organization)
 * organizationId: number;
 * ```
 *
 * in our case external ID was is a number.
 */

export * from './Database.js'
export * from './Resource.js'
