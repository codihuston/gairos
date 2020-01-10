import Sequelize from "sequelize";
import { getDirectories } from "../../utils";
import { existsSync } from "fs";
import { join } from "path";
import { merge, forEach } from "lodash";

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

const gqlSchemas = [];
const gqlResolvers = [];
const models = {};

const dirs = getDirectories(__dirname, true, true);

// import sequelize models
for (const dir of dirs) {
  // TODO: make this file name customizable?
  const modelPath = join(dir, "model.js");
  if (existsSync(modelPath)) {
    const model = sequelize.import(modelPath);
    models[model.name] = model;
  }
  // if a model is not found; warn and skip it...
  else {
    console.warn(
      "WARNING: A model could not be dynamically imported:",
      modelPath
    );
  }
}

// associate the sequelize models (as needeD)
for (const modelName of Object.keys(models)) {
  const model = models[modelName];
  if (typeof model.associate === "function") {
    model.associate(models);
  }
}

export { sequelize, models };

export const compileGraphql = () =>
  new Promise(function(resolve, reject) {
    const promises = [];

    // immediately invoked async function (required use to import() dynamically)
    (async function() {
      for (let dir of dirs) {
        try {
          // warn devs if a module containing gql requirements couldn't be loaded
          if (!existsSync(join(dir, "index.js"))) {
            console.warn(
              "WARNING: module does not exist for:",
              dir,
              ". An index file MUST exist, and MUST export typeDefs and resolvers\
              in order to dynamically import said typeDefs and resolvers.\
              This is optional if you do not want to import a module\
              -- skipping..."
            );
          }
          // dynamically import the typeDefs and resolvers
          else {
            promises.push(
              /*
                NOTE: import() is async; that is why this is promisified.
                It is also NOT a function (like super()), and cannot be assigned
                to a variable.
                See: https://nodejs.org/api/esm.html for implementation
              */
              await import(dir).then(module => {
                return {
                  module,
                  dir
                };
              })
            );
          }
        } catch (e) {
          console.warn("Cannot dynamically load module:", e);
        }
      }

      // only resolve when all promises are done
      Promise.all(promises)
        .then(values => {
          for (const value of values) {
            const { typeDefs, resolvers } = value.module.default;
            if (typeDefs) {
              gqlSchemas.push(typeDefs);
            }
            if (resolvers) {
              gqlResolvers.push(resolvers);
            }
          }

          resolve({
            models,
            resolvers: merge({}, ...gqlResolvers),
            typeDefs: gqlSchemas.join(" ")
          });
        })
        .catch(e => {
          reject(e);
        });
    })();
  });
