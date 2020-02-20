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

As an attempt to approve developer experience, you can either set:

- `DB_SYNC_WITH_SEQUELIZE` to `true` or `false`.
    
    `Note:` This option will be set forcibly to `false` if the `NODE_ENV` matches
`*prod*`

- `DEV_AUTO_LOGIN` to `true` or `false`, which will intialize a session as
using the first seeded user when you make your first request to the server.
This is useful to prevent having to log in manually each time. 
    - This is particularly useful for when developin gon the back-end 
    See section on `GraphiQL Setup` for more info on authentication when working
    on the back-end
    - If working on the front-end, you may want to turn this off so that you
    can test the Google API configuration through your own account (as the
    seeded user does not have a google account)

1. If `true`:
    1. When the server boots up the database will be completely emptied, and
    the seeders will be executed to populate the database with any default rows
    `FOR NON-PRODUCTION ENVIRONMENTS ONLY`
2. If `false`:
    1. The tables should still be automatically created, and they `WILL NOT` be
    truncated, nor will the seeders be ran
        1. You can run the seeders manually in the commandline yourself
    1. `NOTE:` if you make changes to a `model definition`, the change
    `WILL NOT` be reflected in the database unless you either:
        1. Set this option to `true`, or...
        2. Delete the existing table yourself and restart the server

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

1. create the sequelize `model` either way:
    1. Via `sequelize-cli`
        1. move the outputted `model` to a new folder, corresponding to the model name under the `gairos` api: `server/api/gairos` (or the other API directories as needed), and rename the file to `model.js`
    1. Manually under `server/api/gairos/<NEW_MODEL|RESOURCE>/model.js` directory
1. convert the sequelize `model` to ES6+ syntax (as needed), as is consitent
with this project, and complete its schema in this file (used for the database)
    1. It would be ideal to have the relationships between this `model`
and the others completed here at this point as well
1. create and complete the `schema.graphql` for the `model` (used for the
graphql API response ). The schema does not necessarily have to match the
sequelize model
1. create the `resolvers.js` for the `model`; don't complete this yet!
1. create the `datasource.js` for the `model`; this will encapsulate the 
   business logic, and is ultimately used by the  `resolvers` and `*.spec.js`
   files
   
   This file should `export default` a `name` and `Class` property; the `Class`
   needs to be equal to a class that extends the `apollo-datasource` class,
   called `DataSource`. If the `datasource` that you are creating is fetching
   data from an external `REST API`, use `import` the `apollo-datasource-rest` 
   and extend the `RESTDataSource` class. The exports are used to dynamically
   load this this resource with less work on your part.
   
   Note: The `resolvers` only need to worry about whether or not they
   are getting data, not on 'how' they are doing it. You can think of the
   `datasource` as being the `API` to your model, or a `controller` in a
   `model-view-controller` app.
   
   `Data Sources` are  also implemented here in attempt to be forward-thinking,
   and will hopefully implement caching of `database requests` in the future

2. create an `index.js` file for the resource, and `import` + `export default`
   the `model`, `typeDefs`, `resolvers`, and `dataSource`
3. create the `server/api/gairos/MODEL/test` directory
4. in this directory, create the following files for this resource: `unit.spec.js` and `int.spec.js` (stands 
   for integration tests), and `e2e.spec.js` (stands for end-to-end tests).These
   are used to execute a Test Driven Design (TDD) development approach. I will
   refer you to the `Practical Test Pyramid | Unit testing pyramid`.

   NOTE: only create these files if you are going to put tests in them, since
   the test runner expects the test files to have at least one test, otherwise
   the tests will fail.
  
    1. `index.js` the index file in the test directory for this resource should
       export any `mock data` used in your tests. The `mock data` should be
       exactly what your tests should expect in the results in order to pass. 
       This file is purely a tool for organization purposes

       This file should exports:
       1. `mockQueries`, which are mapped to the graphql query in your schema
       that this is meant for. The way they are mapped is purely for 
       organizational purposes
       1. `mockMutations`, which are mapped to the graphql mutation in your
       schema that it is meant for (like `mockQueries`)
       1. `mockResponses`, which are mapped to the `API` methods that you're 
       testing in your `datasource`. 
           1. If this `datasource` is referencing a `3rd party API`, then you
           should test the actual response from their API against how we shape
           it afterwards. I do this by using a custom `reducer` method, which
           simply maps only the fields I intend on using from the
           `3rd party API`
           1. If this `datasource` is referencing a `1st party API`, this
           is not a requirement
           1. The methods that are used by the `graphql resolvers` should simply
           fetch the data; if the data is being processed, that logic should be
           `methodized` so that you can `unit test` them; see the 
           `userAPI.reduce*()` and its corresponding unit test for an example

    2. `unit.spec.js` should test individual methods of the class in the 
       `datasource`. 
       
       You should use `jest` to `jest.spyOn()` and 
       `jest().fn().returnsMockValue()` to spy on how the function is used and 
       to bypass any calls to `external systems`, respectively;
       the point of unit testing is to test a small unit of code
       (like a `function`), and that it returns an expected value for a
       given input (if any).

       View more on `jest` in their documentation.

       1. your test should `import` the `API` that you are testing
       2. `mock` out the method your are testing so that it 
       returns the expected `mock data` (as defined in the index file)
       1. verify that the now-stubbed method, when invoked, will return
       your expected `mockResponses`

       This might look a little useless, but this workflow makes more sense
       when the units you are testing has multiple codepaths which are
       influenced by your input values. You should test each path for expected
       results and errors.

       If a `function/method` does not have any logic in it, then you don't
       really need to unit test it.

    3. `int.spec.js` should test the `datasources` and `resolvers` by way of
       using only `graphql` queries and the API you've defined in the
       `datasource`. You may also test the functionality of the relevant
       `1st party API` if you want, but you'll get essentually the same results
       if you test it through the `graphql query`, as the `resolvers` are
       currently intended to only act as an interface to said API
       
       You should should:

        1. start a graphql server for testing (in code, see the
        `google calendar` API for an example)
        3. fetch the API that you are going to test
        4. If you are using a `3rd party API`, stub the method in the API that
        you are testing to return pre-defined `mock data` . If you are using a 
        `1st party API`, then you may opt to test using the database; that
        is up to you (preferred).
        1. fetch the `mock graphql query` from your mock file
        2. send the server a `graphql` query
        3. verify the results match your expecte `mockResponses`
     1. You may find it useful to create a `seeder` for this model. See the
     `README` in the `server/db/` directory, and reference the seeders under
     `server/db/seeders` for examples on implementation 

Remember, that once you fulfill the `index.js` file for the resource, the
`model`, `typeDefs`, `resolvers`, and `datasource` are dynamically loaded into
the application, and you can immediately begin querying the new resource
after the server restarts.

In your browser, go to your app URL `localhost:APP_PORT/graphql` to test the
graphql API.

#### GraphiQL Setup (GraphQL IDE)
If this is your first time setting up the environment, apply this fix
to your GraphiQL Settings: https://github.com/codihuston/gairos/issues/14

This is required in order to test the GraphQL Mutations that use the GoogleAPI;
you must auth through `localhost:APP_PORT/auth/google`, and then subsequent
requests sent through the GraphiQL IDE will have your google auth tokens
attached to them.

NOTE: This does not apply to the testing environment because the google API
requests are mocked out. This should also not apply to production because
the session should be properly managed between the front-end and back-end
without the `same-origin` issue described in the linked issue.