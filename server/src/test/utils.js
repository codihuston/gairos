import { resolveGraphqlDefinitions } from "../api";
import { ApolloServer } from "apollo-server-express";
import { models } from "../api/gairos";
import faker from "faker";
import { merge } from "lodash";

// this is what the async function "context" will return to the apollo server
const defaultContextReturnValue = {
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

// the context for the apollo server must be an async function
const defaultContext = async ({ req, res }) => {
  // which should return our default context as defined above
  return defaultContextReturnValue;
};

// if a developer wants to provide custom context, use this instead
export const getDefaultContext = opts => {
  return async ({ req, res }) => {
    // merge the given options into the default context
    return merge(defaultContextReturnValue, opts);
  };
};

// this desctructuring defaults incoming context (if not specified)
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

/**
 * Used by the integration tests, which may require a user to be applied to the
 * apollo server context when making authenticated requests
 *
 * @param {*} opts: any valid input for the user model
 */
export const createTestUser = async (opts = {}) => {
  const defaultOpts = {
    id: faker.random.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email()
  };

  return await models.user.create(merge(defaultOpts, opts));
};
