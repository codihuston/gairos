import { loadGQLFile } from "../../../utils";
import model from "./model";
import resolvers from "./resolvers";

export default {
  model,
  typeDefs: loadGQLFile(__dirname, "schema.graphql"),
  resolvers
};
