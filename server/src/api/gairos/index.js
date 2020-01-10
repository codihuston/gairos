/**
 * This is an example of using static imports for modrularized graphql
 * resolvers / typedefs, as opposed to having them defined in only one file.
 *
 * For each model's resolvers + schema, you would have to manually import them
 * here and add them to the exports below.
 *
 * See:
 *  - example/gql-single-file-typedefs-and-resolvers
 *  - example/gql-dynamically-import-typedefs-and-resolvers
 */
import Sequelize from "sequelize";
import { getDirectories } from "../../utils";
import { join } from "path";
import { merge } from "lodash";
import users from "./users";

const models = {};
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres"
  }
);

// import sequelize models
getDirectories(__dirname, true).forEach(path => {
  const modelPath = join(path, "model");
  const model = sequelize.import(modelPath);
  models[model.name] = model;
});

// associate the sequelize models (as needed)
for (const modelName of Object.keys(models)) {
  const model = models[modelName];
  if (typeof model.associate === "function") {
    model.associate(models);
  }
}

export { sequelize, models };
export const resolvers = merge({}, users.resolvers);
export const schema = [users.typeDefs].join(" ");
