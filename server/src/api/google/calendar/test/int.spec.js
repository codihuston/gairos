import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import nock from "nock";
import { resolveGraphqlDefinitions } from "../../../";
import mockResponses from ".";
import { ApolloServer } from "apollo-server-express";
import sinon from "sinon";
import { assert } from "chai";

const mockQueries = {
  getCalendars: gql`
    query {
      getCalendars {
        kind
        etag
        id
        summary
        description
        location
        timeZone
        conferenceProperties {
          allowedConferenceSolutionTypes
        }
      }
    }
  `
};

const defaultContext = async ({ req, res }) => {
  // pass context into our resolvers
  return {
    session: req.session
    // me: models.user.findByLogin("rwieruch")
  };
};

// set the destructured value to a default value (if not specified)
const constructServer = async ({ context } = {}) => {
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

describe("GraphQL Queries", function() {
  it("fetches a list of calendars", async function() {
    const log = this.initTestLog();
    log("Example log in test file");
    /**
     * Create an instance of the ApolloServer, mocking out its context,
     * and reusing the defined dataSources, resolvers, and typeDefs.
     *
     * this function returns as erve rinstance, as well as our dataStore
     * instances, so we can overwrite the underlying fetchers
     */
    const { server, typeDefs, dataSources } = await constructServer({
      context: () => ({
        user: {
          id: 1,
          username: "fake user"
        }
      })
    });

    // fetch the API to test
    const { CalendarAPI } = dataSources;
    log("CALENDAR API", CalendarAPI);
    log("Mock query", typeDefs);

    // stub it out
    sinon.stub(CalendarAPI, "list").returns(mockResponses.list.reduced);

    // init the test server
    const { query } = createTestClient(server);
    const res = await query({ query: mockQueries.getCalendars });
    log("MOCK RESULT", res);
    log("MOCK RESULT", res.data.getCalendars);
    assert.notExists(res.errors);
    assert.deepEqual(res.data.getCalendars, mockResponses.list.reduced);
  });
});
