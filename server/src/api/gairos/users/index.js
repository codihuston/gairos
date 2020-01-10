import { loadGQLFile } from "../../../utils";
import model from "./model";
import resolvers from "./resolvers";

const t = loadGQLFile(__dirname, "schema.graphql");
console.log("BEING IMPORTED B");
console.log("YYY LOGGER", t);
export default {
  model,
  typeDefs: t,
  resolvers,
  name: "USERS"
};
