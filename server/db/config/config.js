import { resolve } from "path";
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
      `For your protection, you cannot drop a database for this environment: ${env}`
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
    dialect: process.env.DB_DIALECT
  };

  if (!(env.includes("prod") || env.includes("ci"))) {
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
    "If you are expecting this behaviour, then it is safe to ignore"
  );
  process.exit(1);
}
module.exports = opts;
