import model from "./model";
import { loadGQLFile } from "../../../utils";
import dataSource from "./datasource";
import resolvers from "./resolvers";

export default {
  model,
  typeDefs: loadGQLFile(__dirname, "./schema.graphql"),
  dataSource,
  resolvers
};
