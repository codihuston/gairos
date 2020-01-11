import { calendar_v3, people_v1 } from "googleapis";
import { merge } from "lodash";
import { join } from "path";
import debugLib from "debug";

import { models } from "./gairos/index";
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

export const people = new people_v1.People({
  auth: oauth2Client
});

export { models };

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
    // import api modules dynamically
    for (let dir of dirs) {
      try {
        debug("Loading API module: ", dir);

        // using require, as it is sync (and cleaner than the import() solution)
        const m = require(dir);

        if (m && m.default) {
          const { typeDefs, resolvers } = m.default;
          if (typeDefs) {
            gqlSchemas.push(typeDefs);
          }
          if (resolvers) {
            gqlResolvers.push(resolvers);
          }
        } else {
          console.warn("SKIPPING: no typeDefs or resolvers specified");
        }
      } catch (e) {
        console.warn("SKIPPING: Cannot dynamically load module:", e);
      }
    }

    // ... and then shape said defs as required by gql server
    resolve({
      models,
      resolvers: merge({}, ...gqlResolvers),
      typeDefs: gqlSchemas.join(" ")
    });
  });
