/**
 * This file exists to load the database credentials for the `sequelize-cli`
 * utility.
 *
 * TODO: change this so that production relies on environment variables only
 * (not strict values written in a file)
 */
// eslint-disable-next-line no-unused-vars
import config from "../../config";
import { isProductionEnvironment } from "../../utils";
let opts = {};

try {
  // parse cmd passed to sequelize (i.e. db:drop)
  const cmd = process.argv[2];

  // protect production from accidental dropping of database...
  if (cmd.includes("db:drop") && isProductionEnvironment) {
    throw new Error(
      `For your protection, you cannot drop a database for this environment!`
    );
  }

  opts = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  };

  console.log("opts", opts);
  
} catch (e) {
  console.error(e);
  process.exit(1);
}
export { opts };
