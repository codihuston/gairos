import { resolve } from "path";
import debugLib from "debug";
const debug = debugLib("server:sequelize-cli:");
let opts = {};

try {
  // parse cmd passed to sequelize (i.e. db:drop)
  const cmd = process.argv[2];
  // parse --env flag value
  const env = process.argv[4];
  // resolve path to appropriate .env file
  const envPath = resolve(`./src/config/.env-${env}`);
  // load said .env file
  const result = require("dotenv").config({ path: envPath });

  console.log("Loading environment variables from:", envPath);

  // protect production from accidental dropping of database...
  if (cmd.includes("db:drop") && env.includes("prod")) {
    throw new Error(
      `For your projection, you cannot drop a database for this environment: ${env}`
    );
  }

  // throw any errors
  if (result.error) {
    throw result.error;
  }

  opts = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    // TODO: port dialect to .env
    dialect: "postgres"
  };

  if (!env.includes("prod")) {
    console.log(
      "Sequelize-Cli is using the following db config options for environment [",
      env,
      "]",
      opts
    );
  }
} catch (e) {
  console.error(e);
  console.error(
    "If you are expecting this behaviour, then it is safe to ignore" +
      "(i.e. if the database already exists when attempting to create)"
  );
  process.exit(1);
}
module.exports = opts;
