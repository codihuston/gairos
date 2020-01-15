import { resolveGraphqlDefinitions } from "../api";
import { ApolloServer } from "apollo-server-express";

const defaultContext = async ({ req, res }) => {
  // pass context into our resolvers
  return {
    session: {
      isAuthenticated: true,
      tokens: {
        access_token: "",
        refreshtoken: ""
      }
    },
    me: {
      id: "",
      username: ""
    }
  };
};

// set the destructured value to a default value (if not specified)
export const buildApolloServer = async ({ context = defaultContext } = {}) => {
  const {
    typeDefs,
    resolvers,
    dataSources
  } = await resolveGraphqlDefinitions();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    context
  });

  return { server, typeDefs, resolvers, dataSources: dataSources() };
};
