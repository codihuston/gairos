import { loadGQLFile } from "../../../utils";
import resolvers from "./resolvers";

export default {
  typeDefs: loadGQLFile(__dirname, "schema.graphql"),
  resolvers
};
