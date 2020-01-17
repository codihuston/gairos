import model from "./model";
import { loadGQLfile } from "../../../utils";
import dataSource from "./datasource";
import resolvers from "./resolvers";

export default {
  model,
  typeDefs: loadGQLfile(__dirname, "schema.graphql"),
  resolvers,
  dataSource
};
