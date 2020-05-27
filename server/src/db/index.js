import Sequelize from "sequelize";
import { execSync } from "child_process";
import { join, resolve } from "path";
import debugLib from "debug";
import glob from "glob";

import config from "../config";
import { isProductionEnvironment, isCIEnvironment } from "../utils";

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
    dialect: process.env.DB_DIALECT,
    logging: !(isProductionEnvironment || isCIEnvironment)
  }
);

const models = {};
const modelPaths = glob.sync(join(__dirname, "/models/*.js"));

debug(`Found [${modelPaths.length}] models`);

// import sequelize models
for (const modelPath of modelPaths) {
  debug(`Loading model from: ${modelPath}`);
  const model = sequelize.import(modelPath);
  models[model.name] = model;
}

// associate the sequelize models (as needeD)
for (const modelName of Object.keys(models)) {
  const model = models[modelName];
  if (typeof model.associate === "function") {
    model.associate(models);
  }
}

export { models };

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
    console.log(`Initializing the database '${process.env.DB_NAME}', conn string`);

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
};
