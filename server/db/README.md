# Purpose

This directory only exists as an output for `sequelize-cli`. This directory
is not processed or used in any way by the `server` application itself, only
the aforementioned command line utility.

## Why To Use Sequelize-Cli

The `sequelize-cli` is primarily used to scaffold `models`, `seeders`, and
`migrations`. It is designed to improve developer workflow. Using this is
entirely optional for the developer.

However, the database initialization is handled by `sequelize-cli` automatically
by some commands in `package.json`. This is to ensure that the database exists
prior to starting the `server`, which is a strict requirement.

## How To Use Sequelize-Cli

You can execute sequelize-cli via `npx sequelize-cli` without installing any
dependencies. The `sequelize.rc` file in the root of `server` configures it
output to this directory.

I specified a `.sequelizerc` configuration in the root of `server` so that I
could utilize ES6 import/export syntax in the sequelize model.

### For Generating Models

`VERY IMPORTANT:` After creation, `models` do not get used by the `server`
where they are output to. After creation, you MUST `move` the generated `model`
from its output directory `server/db/models` to
`server/src/api/MODEL_NAME/index.js`, and then convert it from `commonJS` to
`ES6`!

Example usage
```
npx sequelize model:generate --name user --attributes username:string,email:string,id:integer

Sequelize CLI [Node: 12.13.0, CLI: 5.5.1, ORM: 5.21.3]

New model was created at C:\Users\Codi\git\gairos\server\db\models\user.js .
New migration was created at C:\Users\Codi\git\gairos\server\db\migrations\20200111174307-user.js .
```

### For Generating Migrations

See `For Generating Models`. You may follow `sequelize-cli` docs for generating
stand-alone migrations specifically.

Note: By default, when the `server` is started in a
`NON-PRODUCTION ENVIRONMENT`, the database will `sync` using the `sequelize`
library in `server/src/bin/www.js`, which automatically generates the database
schema and tables.

Currently, generation of the database schema and tables cannot be done
automatically for a `PRODUCTION ENVIRONMENT`.

### For Generating Seeders

You many follow `sequelize-cli` docs for generating seeders. In the generated
files you should convert the `commonJS` to `ES6` to maintain consistency across
the codebase.

Seeders will be automatically ran if `DB_SYNC_WITH_SEQUELIZE` is set to `true`
in the relevant `.env-*` file.

`IMPORTANT:` know that the entire database will be `TRUNCATED` if
`DB_SYNC_WITH_SEQUELIZE` is set to `true` for `NON-PRODUCTION ENVIRONMENTS`.
