// eslint-disable-next-line no-unused-vars
import config from "../config";
import { isProductionEnvironment } from "../utils";
import init, { sequelize } from ".";

/**
 * This file is intended for use in NON-PRODUCITON environments
 * and will spring up the database tables as per the Sequelize model definitions
 * in `server/src/db/models`.
 */
async function main() {
  await init();

  const shouldSyncDb = !isProductionEnvironment;
  if (shouldSyncDb) {
    console.log("Syncing database...");
    // having this in a k8s dev environment is a problem!
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
