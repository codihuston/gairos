# Gairos: Time Keeper and Scheduler

## For Developers: Getting Started
### Backend
In the `/server/src/config`, copy `.env-example` into `.env-development` and 
populated the provided fields as needed.

To start the database, run: `docker-compose up` in the root of this project. View
the `docker-compose.yml` file for details on the database services. If you are
using a database client locally, you can access the database via `localhost:54320`.
You may opt to use the provided `pgadmin4` at `localhost:54321`. Due to a bug
with either `docker-compose` or the `pgadmin4` container provided, the specified
server settings are not auto-populated upon being mounted to the docker 
container. Therefore, you will need to provide a server connection in the
`pgadmin4` web app upon initial setup. You may use either:

1. Your host IP address and the port `54320` as defined in `docker-compose.yml`
   to connect
2. Or, you may use the static ip, also defined in `docker-compose.yml`, to 
   connect; see the `pgadmin` service in said file for the required setup
   information