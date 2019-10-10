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

## Warning

Typescript developers who want to use admin-bro of version `~1.3.0` temporary avoid this construction till they fix it in the next versions.
```typescript
import { Database, Resource } from "admin-bro-typeorm";
import { default as AdminBro } from "admin-bro";

AdminBro.registerAdapter({ Database, Resource });
```
The reason of the problem is incorrect `*.d.ts` declarations for typings support. 

They export sources directly from `./src`, for example, not from `./dist` or `./lib` (compilation output).

You will have billion compilation errors kinda:

`node_modules/admin-bro/src/backend/utils/view-helpers.ts(91,5): error TS2322: Type 'string | undefined' is not assignable to type 'string'.`

So lets hope they'll fix it soon.