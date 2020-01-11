import Sequelize from "sequelize";
import config from "../config";

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
     * For developer experience, if this option is on, the database will be
     * re-built on every build EXCEPT FOR when the environment is PRODUCTION!
     *
     * If the database is wiped, seeders will also be ran.
     */
    const eraseDatabaseOnSync =
      process.env.DB_SYNC_WITH_SEQUELIZE.toLowerCase() == "true" &&
      !process.env.NODE_ENV.toLowerCase().includes("prod");

    console.log("Please wait while connecting to the database...");
    console.log("Sequelize sync option is set to", eraseDatabaseOnSync);

    await sequelize.sync({
      force: eraseDatabaseOnSync
    });

    console.log("Database connection succeeded!");

    // execute seeders if the database was emptied
    if (
      eraseDatabaseOnSync &&
      !process.env.NODE_ENV.toLowerCase().includes("prod")
    ) {
      console.log("Please wait while executing database seeders *ASYNC*...");
      exec(
        "yarn run db:seed:dev",
        {
          cwd: resolve(__dirname, "..", "..") // server root
        },
        (err, stdout, stderr) => {
          if (err) {
            console.error(err);
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
