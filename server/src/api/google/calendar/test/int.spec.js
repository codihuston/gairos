import { createTestClient } from "apollo-server-testing";
import sinon from "sinon";

import { buildApolloServer } from "../../../../test/utils";
import { mockResponses, mockQueries } from ".";

describe("GraphQL Queries", function() {
  it("fetches a list of calendars", async function() {
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

    // stub it out
    sinon.stub(CalendarAPI, "list").returns(mockResponses.list.reduced);

    // init the test server
    const { query } = createTestClient(server);
    const res = await query({ query: mockQueries.getMyCalendars });

    expect(res.errors).not.toBeDefined();
    expect(res.data.getMyCalendars).toEqual(mockResponses.list.reduced);
  });
});
