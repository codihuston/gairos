import { combineResolvers } from "graphql-resolvers";
import { HexColorCodeResolver, EmailAddressResolver } from "graphql-scalars";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from "graphql-iso-date";

import { isAuthenticated } from "../../../middleware/graphql";

export default {
  HexColorCode: HexColorCodeResolver,
  EmailAddress: EmailAddressResolver,
  GraphQLJSON,
  GraphQLJSONObject,
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime,
  Query: {
    version: combineResolvers(isAuthenticated, () => {
      return process.env.APP_VERSION;
    })
  },
  /**
   * for the sake of defining the root mutation in one place, this is more of
   * a placeholder, and does not actually mutate anything
   */
  Mutation: {
    version: combineResolvers(isAuthenticated, () => {
      return process.env.APP_VERSION;
    })
  }
};
