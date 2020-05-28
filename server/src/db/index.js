import Sequelize from "sequelize";
import { join } from "path";
import debugLib from "debug";
import glob from "glob";

import config from "../config";
import { isProductionEnvironment, isCIEnvironment } from "../utils";

const debug = debugLib("server:db-init");
const models = {};
const modelPaths = glob.sync(join(__dirname, "/models/*.js"));
let connectionString = "";

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging:
      !(isProductionEnvironment || isCIEnvironment) === false
        ? false
        : console.log,
  }
);

try {
  // used to init database if it doesn't exist
  connectionString = `${process.env.DB_DIALECT}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DIALECT}`;

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
} catch (e) {
  throw e;
}

export { models, connectionString };
