# Purpose

This directory only exists for 2 reasons:

1. The `index` file will create the database if it does not exist, as well
as initialize the sequelize connection to the database, and the model instances.

    > Note: The server application does this out-of-box as soon as the
    application starts.

1. The `migrations`, `models`, and `seeders` directories contain output for
the `sequelize-cli` cli utility. The only directory used by the  `server`
application itself is the `models` directory. The others are only used by the aforementioned command line utility.

    > Note: The server applicatiion does execute `migrations` or `seeders`
    out-of-box. These must be done manually using `npm` commands defined in the
    `package.json` file.

The `server/.sequelizerc` file configures the utility to output to this
directory. This is done so that we can utilize ES6 import/export syntax in the
sequelize model definitions.

## For Development Environment

This section describes the pre-packaged commands for syncing, migrating,
and seeding the database in a development environment. These commands
must be run manually from either your host machine or from one of the
`server-deployment` pods.

If you want to run the commands from your host machine, you will need to
configure your `.env-*` file to point to the database using the exposed ports
as discussed in the root readme and `k8s-dev/sql-deployment.yml` files.

If you want to run the commands from the Kubernetes Pod initialized via
`skaffold`, run the following:

```cmd
// from project root, same dir as skaffold.yml
> skaffold dev
> kubectl get pods

NAME                                 READY   STATUS    RESTARTS   AGE
server-deployment-7f464847c8-25wkt   1/1     Running   0          10m
sql-deployment-6984957c7f-t2w88      1/1     Running   0          78m

// wait for both pods to be READY

// get shell access into the pod
> kubectl exec -it server-deployment-7f464847c8-25wkt sh
```

You can now run the commands discussed below in the `/app` directory (which
you should be placed into automatically).

### Generating Models, Migrations, and Seeders

See the [sequelize-cli](https://sequelize.org/master/manual/migrations.html) for
how to generate these files.

After generating any of these files, convert them from the `CommonJS` snytax
to the `ES6 Import / Export` syntax to keep the codebase consistent.
See existing files for examples.

### Syncing the Database to the Sequelize Models

For development, it is handy to be able to ensure that the database schema
matches the model definitions exactly. For this, you can run:

```cmd
yarn dev:db:sync
```

> Note: Know that this will destroy the database and rebuild it from scratch!
This command does not work in Production.

> Note: It is important to have a migration defined alongside a model, which is
either the initial model definition , or a definition that will mutate the
pre-existing schema to conform to the new model (useful for making changes
to a database in production). See the `Production` section for more info.

### Running Migrations

Migrations are essentially the schema definition of the model. Generally,
the defined fields should match those defined in the corresponding model.
In production, you would use these instead of the sync option in order to get
your existing database schema to a state such that your model
definitions match your database schema as close as you might desire.

```cmd
yarn dev:db:migrate
```

### Running Seeders

Seeders are userd for generating mass data (typically dummy data) that is to be
inserted into your database. This could be useful in all environments. Ideally,
you would run each of them individually, as needed, or run all of them at once.
The former would be an approach to take in production. The latter would likely
suffice in non-production environments.

The following command runs all seeders:

```cmd
yarn dev:db:seed
```

## For Test Environment

Not implemented. If you want to run tests, start the server on your host machine
(not the Kubernetes Pod), and run the commands from your host machine as well.
Be sure to configure your `.env-test` environment variables accordingly.

## For CI Environment

At CI/CD time, an image is built of each component (server, client), and the
test commands are ran. If the test commands rely on an existing database (read:
integration/e2e tests), the apps assume that those required hosts exist and the
connections will succeed. Those containers will expect to be passed the required
connection information at that time.

## For Production Environment

For this environment, you would only want to run these commands depending on
certain conditions.

### Migrations

You would run this if either:

1. You are initializing the database schema for the first time

1. The database schema exists and you are updating it

In either case, you should be able to use:

```cmd
yarn prod:db:migrate
```

Sequelize keeps tracks of migrations that are made in your database, and will
not re-run them if they have already been ran.

### Seeders

You would run this in the following cases:

1. You want to initialize some default data / users / etc. once your database
has been created for the first time, or if a feature is being rolled out for
the first time (that requires initial data)

`You would not want to re-run every single seeder`, as you may encounter unique
constraints since this data is likely hard-coded, and `whether or not a seeder
is ran IS NOT tracked by Sequelize (like migrations are)`. So, in production,
you would want to run an individual seeder file, one at a time. You can do that
using the cli tool directly:

```cmd
npx sequelize-cli db:seed <seeder file name>
```

> NOTE: You just need to specify the file name. The `.sequelizerc` file tells
the cli where to find them.

> NOTE: You will want to ensure that the `NODE_ENV` environment variable
is set accordingly prior to running this command
