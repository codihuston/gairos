import Sequelize from "sequelize";
import { getDirectories } from "../../utils";
import { existsSync } from "fs";
import { join } from "path";
import { merge, forEach } from "lodash";
import users from "./users";

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

// const gqlSchemas = [];
// const gqlResolvers = [];
const models = {};

getDirectories(__dirname, true).forEach(path => {
  // TODO: import sequelize models
  const modelPath = join(path, "model");
  const model = sequelize.import(modelPath);
  models[model.name] = model;

  // TODO: import gql resolvers + schemas dynamically?
  // note: had to implement babel-eslint in .eslintrc.json for this to compile
  // IMPORTANT: cannot seem to import graphql schema dynamically due to async nature
  // of Import()
  // if (!existsSync(join(path, "index.js"))) {
  //   console.warn(
  //     "WARNING: module does not exist for: ",
  //     path,
  //     " - skipping..."
  //   );
  // } else {
  //   import(path)
  //     .then(({ typeDefs, resolvers }) => {
  //       if (schema) {
  //         gqlSchemas.push(schema);
  //       }
  //       if (resolvers) {
  //         gqlResolvers.push(resolvers);
  //       }
  //       console.log("Schemas", gqlSchemas);
  //       console.log("ResolverS", gqlResolvers);
  //     })
  //     .catch(e => {
  //       console.error(e);
  //     });
  // }
});

// associate the sequelize models (as needeD)
forEach(models, function(model) {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

export { sequelize };
export default models;
export const resolvers = merge({}, users.resolvers);
export const schema = [users.typeDefs].join(" ");
