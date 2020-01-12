import Sequelize from "sequelize";
import { exec } from "child_process";
import { resolve } from "path";
import debugLib from "debug";
import config from "../config";
import { isProductionEnvironment } from "../utils";

const debug = debugLib("server:db-init");

// used to init database if it doesn't exist
const connectionString = `${process.env.DB_DIALECT}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DIALECT}`;

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  }
);

export default async () => {
  try {
    /**
     * Initialize this database if it does not exist; note, this connection
     * assumes that the default database (required in order to connect) is
     * the same name as process.env.DB_DIALECT.
     *
     * For example, postgres and mysql both have a default database of the same
     * names upon initialization of each service.
     */
    console.log(`Initializing the database '${process.env.DB_NAME}'`);

    const tempConnection = new Sequelize(connectionString);
    await tempConnection.queryInterface.createDatabase(process.env.DB_NAME);

    console.log(`Database '${process.env.DB_NAME}' successfully created!`);
  } catch (e) {
    if (e.message.toLowerCase().includes("already exists")) {
      console.warn(
        `WARNING: Database '${process.env.DB_NAME}' already exists -- SKIPPING`
      );
    } else {
      throw e;
    }
  }

  try {
    const eraseDatabaseOnSync =
      process.env.DB_SYNC_WITH_SEQUELIZE.toLowerCase() == "true" &&
      !process.env.NODE_ENV.toLowerCase().includes("prod");
    const exitIfSeedersFail =
      process.env.FAIL_BUILD_IF_SEEDERS_FAIL.toLowerCase() == "true";

    /**
     * For developer experience, if this option is on, the database will be
     * re-built on every build EXCEPT FOR when the environment is PRODUCTION!
     *
     * If the database is wiped, seeders will also be ran.
     */
    console.log("Please wait while connecting to the database...");
    console.log("Sequelize sync option is set to", eraseDatabaseOnSync);

    await sequelize.sync({
      force: eraseDatabaseOnSync
    });

    console.log("Database connection succeeded!");

    /**
     * Execute seeders if the database was emptied.
     *
     * IMPORTANT: this utilizes this repository's `package.json` file
     * to execute the seeders asynchronously--the npm script MUST match
     * the name of NODE_ENV in order to successfully executed:
     *
     * For example: db:seed:NODE_ENV
     *
     * NOTE: If the database fails to be seeded, the build process WILL
     * fail and be halted if and only if process.env.FAIL_BUILD_IF_SEEDERS_FAIL
     * is true set to true
     */
    if (eraseDatabaseOnSync && !isProductionEnvironment) {
      console.log("Please wait while executing database seeders *ASYNC*...");

      exec(
        `yarn run db:seed:${process.env.NODE_ENV}`,
        {
          cwd: resolve(__dirname, "..", "..") // server root
        },
        (err, stdout, stderr) => {
          if (err) {
            console.error("seeder:stderr:", err);

            if (exitIfSeedersFail) {
              console.error(
                "ERROR: Seeder failed to execute; the database may",
                "have been partially seeded, or not at all!",
                "STOPPING the server because 'FAIL_BUILD_IF_SEEDERS_FAIL' is",
                "enabled!"
              );
              process.exit(1);
            } else {
              console.warn(
                "WARNING: Seeder failed to execute; the database may",
                "have been partially seeded, or not at all!"
              );
            }
          } else {
            // the *entire* stdout and stderr (buffered)
            console.log("Finished executing seeders! See output below:");
            debug(`seeder:stderr: ${stderr}`);
            debug(`seeder:stdout: ${stdout}`);
          }
        }
      );
    }
  } catch (e) {
    throw e;
  }
};
