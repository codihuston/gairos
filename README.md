# Gairos: Time Keeper and Scheduler

## For Developers: Getting Started

### Backend

In the `/server/src/config`, copy `.env-example` into `.env-development` and
populated the provided fields as needed.

#### Environment Setup

In the `.env-development` file, configure your database host to `localhost` and
the port specified in the `postgres` service in the `docker-compose.yml`, which
is `54320` by default. Please note the following two things:

1. Be sure that the database credentials you specifiy do infact point to the
correct service; if you have an existing service running at the specified
on your machine host and port, the server may not accurately report a connection
error when connecting to what it expects to be a database, and the server may
hang during initial startup

1. If you want to change any values in the `docker-compose.yml` file, you must
set those corresponding values in `YOUR ENVIRONMENT`; that is, create a matching
environment variable with a custom value of your own choice, and `docker` should
honor that; `DO NOT` make changs to `docker-compose.yml` and commit them.

You must also configure the google api section of `.env-developent` in order
for the google api's to be accessible. Those steps are as follows:

Steps:

1. Create a project in Google Cloud Platform
    1. Navigate to "Menu" > "APIs & Services"
    1. Click, "Enable APIS AND SERVICES"
        1. Search for "Google Calendar API" and enable
        1. Search for "Google People API" and enable
1. From the project dashboard (menu icon, top left),
click "APIs & services" > Dashboard
    1. Click,  "OAuth consent screen"
    1. Select, "External"
    1. Click, "Create"
    1. Fill out the page accordingly and click, "Save"
1. From the project dashboard (menu icon, top left),
click "APIs & services" > Dashboard
    1. Click, left navigation menu: "Credentials"
    1. Click, "+ CREATE CREDENTIALS"
    1. Click, "Create OAuth client ID"
    1. Select, Web application
    1. Name the app: `Gairos`
    1. Apply restrictions (optiona; do as needed)
    1. You are then prompted with a dialog that contains a Client ID and
    Client Secret
    1. Record these in your `.env-development` where appropriate
        1. IMPORANT: callback urls must match here and in the server

Lastly, as an attempt to approve developer experience, you can either set
`DB_SYNC_WITH_SEQUELIZE` to `true` or `false`.

`Note:` This option will be set forcibly to `false` if the `NODE_ENV` matches
`*prod*`

1. If `true`:
    1. When the server boots up the database will be completely emptied, and
    the seeders will be executed to populate the database with any default rows
    `FOR NON-PRODUCTION ENVIRONMENTS ONLY`
1. If `false`:
    1. The tables should still be automatically created, and they `WILL NOT` be
    truncated, nor will the seeders be ran
        1. You can run the seeders manually in the commandline yourself
    1. `NOTE:` if you make changes to a `model definition`, the change
    `WILL NOT` be reflected in the database unless you either:
        1. Set this option to `true`, or...
        1. Delete the existing table yourself and restart the server

#### Database Setup
The database server must be running in order for the server to start.

To start the database, run: `docker-compose up` in the root of this project. View
the `docker-compose.yml` file for details on the database services. If you are
using a database client locally, you can access the database via the same
address mentioned at the beginning of the previous section.

Or, you may opt to use the provided `pgadmin4` in your browser at
`localhost:54321`. The credentials are in `docker-compose.yml`, and the
username/password are both: `admin`; both values are default.

Due to a bug with either `docker-compose` or the `pgadmin4` container provided,
the specified server settings may not be auto-populated by the `pgadmin4`
container upon starting. Therefore, you may need to provide a server
connection in the `pgadmin4` web app upon initial setup after logging in.
You may use either:

1. Your `host IP address; NOT localhost!` and the port `54320` as defined in
`docker-compose.yml` to connect. This is due to how the container network has
been configured. The containers are not bridged to the host network, so
specifying `localhost` here refers to the `pgadmin4` container itself, not
your machine. Since your IP address may change, I suggest
the following option...
2. You may use the static ip address configured by a custom network for this
setup, which also defined in `docker-compose.yml`, the static ip is defaulted to
`172.25.0.2`. Since you are using the static ip in the containerized network,
you will need to use the internal port being `5432` instead of the port mapped
from the host. These two values are default, and cannot be configured by custom
environment variables reliably at this moment.
3. Maybe later I will bridge the network config, but for now, this works...

#### Running the Server for Development

The recommended way to run the server is to use:

1. `yarn run watch:debug`
    1. will automatically re-run the server when you change any file in
    `server/src` (see `nodemon.json` to see which files are watched), as well as
    log your debug messages (implemented with the `debug npm module`)
1. `yarn run watch`
    1. this option does not print your debug messages

If you do not want the server to restart automatically on your changes, run
either:

1. `yarn run dev`
1. or `yarn run dev:debug` to see your debug mesages

The order in which the server is built looks like this
(initialized by the commands mentioned above):

1. lint (via `eslint`)
1. create database, see `server/src/db` for details (may error out if db exists, but does
not stop build process. This is expected behavior)
1. run server with babel-node (`server/bin/www.js`) to support `import/export` 
in the node environment
    1. in `server/src/db`, conditionally truncate/sync database and execute seeders
    asynchronously based on `DB_SYNC_WITH_SEQUELIZE`

#### Debugging the Server

It is recommended to use the `debug npm module` in your files, with the `server:`
prefix, followed by an identifier of your choosing (i.e. `server:my-feature`). These are only printed to the log when using the `watch:debug` command.

If you are having build issues, I suggest setting an environment variable
`DEBUG=*` and running `yarn run dev` to see the full debug information from each
3rd party library.

#### Testing the Server

If you want to run unit tests, first create the `.env-test` file in
`server/src/config`, similarly to how you created `.env-development`.

Then run either of the following commands:

1. `yarn run test`
1. `yarn run watch:test` will re-run tests when you make file changes; see
`nodemon-test.json` for which files are being watched

Note:

1. if your development server is currently running when attempting to run tests,
and if your `.env-test` has your test server listening on the same port, the
tests cannot run. It is recommended to run only one environment at a time at
this moment; otherwise, configure your `.env-test` differently. 

    `Note: they may use the same DB_* credentials, it is just the APP_*
    variables that I am referring to`

1. either of the above testing options will print debug messages that use
the `debug npm module`. The messages, when printed, will include the
test suite name, and name of the test itself in hopes to make the logs more
readable, assisting with debugging. See `server/test` for how that utilize this
logger.

#### Actually Developing

I recommend the following workflow when creating a new API resource:

1. create the sequelize `model` either way::
    1. Via `sequelize-cli`
        1. move the outputted `model` to a new folder, corresponding to the model name under the `gairos` api: `server/api/gairos` (or the other API directories as needed), and rename the file to `model.js`
    1. Manually under `server/api/gairos/<NEW_MODEL|RESOURCE>/model.js` directory
1. convert the sequelize `model` to ES6+ syntax (as needed), as is consitent
with this project, and complete its schema in this file (used for the database)
    1. It would be ideal to have the relationships between this `model`
and the others completed as well
1. create and complete the `schema.graphql` for the `model` (used for the
graphql API response ). The schema does not necessarily have to match the
sequelize model
1. create the `resolvers.js` for the `model`; don't complete this yet!
1. create an `index.js` file for the resource, and export the `model`,
`typeDefs`, and `resolvers`
1. create the `int.spec.js` (stands for integration tests) and
`unit.spec.js` files for this resource
1. execute a Test Driven Design (TDD) approach by coding the tests before the
functionality in the `model` and `resolvers` files
  
    1. test any individual methods on the `model` in `unit.spec.js`
    1. test any resolver functionality in `int.spec.js`

Remember, that once you fulfill the `index.js` file for the resource, the
`model`, `typeDefs` and `resolvers` are dynamically loaded into the application,
and you can immediately begin querying the new resource after the server
restarts.

In your browser, go to your app URL `localhost:APP_PORT/graphql` to test the
graphql API.
