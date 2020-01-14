import { createTestClient } from "apollo-server-testing";
import sinon from "sinon";
import { assert } from "chai";
import { buildApolloServer } from "../../../../test";
import mockResponses, { mockQueries } from ".";

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
    const { server, typeDefs, dataSources } = await buildApolloServer({
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
