import { resolveGraphqlDefinitions } from "../api";
import { ApolloServer } from "apollo-server-express";
import { models } from "../api/gairos";
import faker from "faker";
import { merge, cloneDeep } from "lodash";

// this is what the async function "context" will return to the apollo server
const defaultContextReturnValue = {
  session: {
    isAuthenticated: true,
    tokens: {
      access_token: "",
      refresh_token: ""
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
  return ({ req, res }) => {
    /**
     * Because the tests may setup the apollo testing server back-to-back,
     * the context object is MUTATED and appears to  attach the property:
     * `context.dataSources`. As a result, when re-building the testing server,
     * this property pre-exists on the instance, and throws an exception:
     *
     * "Please use the dataSources config option instead of putting dataSources
     * on the context yourself."
     *
     * See: https://github.com/apollographql/apollo-server/issues/2144
     *
     * To fix this, just ensure that a new context object is always passed
     * into the apollo server options...
     *
     * This also merges the given options into the default context to allow
     * external customization
     */
    return cloneDeep(merge(defaultContextReturnValue, opts));
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
    username: "sample user A",
    isConfirmed: true
  },
  {
    id: "0bdc487a-8ad7-4264-b28d-d02dbbef787c",
    googleId: "people/some-fake-id-02",
    username: "sample user B",
    isConfirmed: true
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
    email: faker.internet.email(),
    isConfirmed: true
  };

  return await models.user.create(merge(defaultOpts, opts));
};
