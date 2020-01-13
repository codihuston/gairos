import { loadGQLFile } from "../../../utils";
import model from "./model";
import resolvers from "./resolvers";
import dataSource from "./datasource";

export default {
  model,
  typeDefs: loadGQLFile(__dirname, "schema.graphql"),
  resolvers,
  dataSource
};
