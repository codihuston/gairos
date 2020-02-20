import { merge } from "lodash";
import { join } from "path";
import debugLib from "debug";
import glob from "glob";

import { models, sequelize } from "../db";
import { GooglePeople, GoogleCalendar } from "./google";

// fetch the modules in each sub-directory under /api
const debug = debugLib("server:api");
const dirs = glob.sync(join(__dirname, "**/**/index.js"), {
  ignore: [join(__dirname, "index.js"), join(__dirname, "*/index.js")]
});

export { GooglePeople, GoogleCalendar };
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
    const gqlSchemas = [];
    const gqlResolvers = [];
    const gqlDataSources = {};

    // import api modules dynamically
    for (let dir of dirs) {
      try {
        debug("Loading API module: ", dir);

        // using require, as it is sync (and cleaner than the import() solution)
        const m = require(dir);

        if (m && m.default) {
          const { typeDefs, resolvers, dataSource } = m.default;

          // load typdefs
          if (typeDefs) {
            gqlSchemas.push(typeDefs);
          } else {
            debug(
              "\tWARNING: Graphql Schema not found for this resource (optional)"
            );
          }

          // load resolvers
          if (resolvers) {
            gqlResolvers.push(resolvers);
          } else {
            debug(
              "\tWARNING: Graphql Resolvers not found for this resource (optional)"
            );
          }

          // load datasource
          if (dataSource) {
            // pass models into this api (removes need for import)
            gqlDataSources[dataSource.name] = new dataSource.Class({
              models,
              sequelize
            });
          } else {
            debug(
              "\tWARNING: Graphql Data Source not found for this resource (optional)"
            );
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
      typeDefs: gqlSchemas.join(" "),
      dataSources: () => gqlDataSources
    });
  });
