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

/**
 * Used by user seeder and default session in the development environment
 */
export const defaultUsers = [
  {
    id: "0bdc487a-8ad7-4264-b28d-d02dbbef787b",
    googleId: "people/some-fake-id-01",
    username: "sample user A"
  },
  {
    id: "0bdc487a-8ad7-4264-b28d-d02dbbef787c",
    googleId: "people/some-fake-id-02",
    username: "sample user B"
  }
];
