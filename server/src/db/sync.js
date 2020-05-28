// eslint-disable-next-line no-unused-vars
import config from "../config";
import Sequelize from "sequelize";
import { isProductionEnvironment } from "../utils";
import { connectionString, sequelize } from ".";

/**
 * This file is intended for use in NON-PRODUCITON environments
 * and will spring up the database tables as per the Sequelize model definitions
 * in `server/src/db/models`.
 */
async function main() {
  let wasDatabaseCreated = false;

  try {
    /**
     * Initialize this database if it does not exist; note, this connection
     * assumes that the default database (required in order to connect) is
     * the same name as process.env.DB_DIALECT, which is also used to tell
     * Sequelize which sql dialect it will be using (see sequelize docs).
     *
     * A connection string is used so that the new db can be created if needed.
     *
     * For example, postgres and mysql both have a default database of the same
     * names upon initialization of each service.
     */
    console.log(
      `Initializing the database '${process.env.DB_NAME}'`,
      connectionString
    );

    const tempConnection = new Sequelize(connectionString);
    await tempConnection.queryInterface.createDatabase(process.env.DB_NAME);

    console.log(`Database '${process.env.DB_NAME}' successfully created!`);

    wasDatabaseCreated = true;
  } catch (e) {
    if (e.message.toLowerCase().includes("already exists")) {
      console.warn(
        `WARNING: Database '${process.env.DB_NAME}' already exists -- SKIPPING`
      );
    } else {
      throw e;
    }
  }

  // sync only in NON-PRODUCITON ENVIRONMENTS, or if the db was newly created!
  const shouldSyncDb = !isProductionEnvironment || wasDatabaseCreated;
  if (shouldSyncDb) {
    console.log("Syncing database...");

    // now that we know the database exists, let's sync it with the sequelize
    // connection instance
    await sequelize.authenticate();

    await sequelize.sync({
      force: true,
      logging: console.log,
    });
  } else {
    console.log("Cannot sync database in PRODUCTION! Exiting...");
  }
}

try {
  main();
} catch (e) {
  console.error(e);
}
