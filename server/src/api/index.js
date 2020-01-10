import { calendar_v3 } from "googleapis";
import { merge } from "lodash";
import { join } from "path";
import debugLib from "debug";

import { sequelize, models } from "./gairos/index";
import { oauth2Client } from "../services/auth/google";
import glob from "glob";

const debug = debugLib("server:api");
const gqlSchemas = [];
const gqlResolvers = [];
// fetch the modules in each sub-directory under /api
const dirs = glob.sync(join(__dirname, "**/**/index.js"), {
  ignore: [join(__dirname, "index.js"), join(__dirname, "*/index.js")]
});

export const calendar = new calendar_v3.Calendar({
  auth: oauth2Client
});

export { sequelize, models };

/**
 * Dynamically import all `.grapqhl` schema (typeDefs) and their resolvers and
 * format them as required by the graphql server. This is required to ensure
 * that the schema is fully built before initializing the graphql server.
 *
 * @returns {
 *  typeDef: string
 *  resolvers: object
 * }
 */
export const resolveGraphqlDefinitions = () =>
  new Promise(function(resolve, reject) {
    const promises = [];

    // immediately invoked async function (required use to import() dynamically)
    (async function() {
      for (let dir of dirs) {
        try {
          debug("Loading API module: ", dir);
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
          // }
        } catch (e) {
          console.warn("SKIPPING: Cannot dynamically load module:", e);
        }
      }

      // only resolve when all promises are done
      Promise.all(promises)
        .then(values => {
          // compile the gql defs onto separate arrays
          for (const value of values) {
            if (value.module && value.module.default) {
              const { typeDefs, resolvers } = value.module.default;
              if (typeDefs) {
                gqlSchemas.push(typeDefs);
              }
              if (resolvers) {
                gqlResolvers.push(resolvers);
              }
            } else {
              console.warn("SKIPPING: no typeDefs or resolvers specified");
            }
          }

          // ... and then shape said defs as required by gql server
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
