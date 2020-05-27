import { loadGQLFile } from "../../../utils";
import resolvers from "./resolvers";
import dataSource from "./datasource";

export default {
  typeDefs: loadGQLFile(__dirname, "schema.graphql"),
  resolvers,
  dataSource
};
