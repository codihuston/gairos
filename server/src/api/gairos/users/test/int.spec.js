import { createTestClient } from "apollo-server-testing";
import sinon from "sinon";
import debugLib from "debug";

import DatabaseConnector from "../../../../db";
import {
  getDefaultContext,
  buildApolloServer,
  createTestUser
} from "../../../../test/utils";
import { mockResponses, mockQueries, mockMutations } from ".";

const debug = debugLib("test:tags");
let user = null;

describe("user integration tests", function() {
  beforeAll(async () => {
    await DatabaseConnector();
    user = await createTestUser();
  });

  it("gql mutation: creates a user tag", async function() {
    // define data used for query/mutation
    const mutationName = "createMyTag";
    const mutation = mockMutations[mutationName];
    const variables = {
      name: "FAKE TASK",
      description: "Fake Description"
    };

    // create an instance of the server
    const { server, typeDefs, dataSources } = await buildApolloServer({
      // set user in context
      context: getDefaultContext({ me: user })
    });

    debug(
      "user in context",
      await getDefaultContext({ me: user })({ req: null, res: null })
    );

    // init the test server
    const { mutate } = createTestClient(server);

    // submit gql query/mutation
    const res = await mutate({
      mutation,
      variables
    });

    debug("result", JSON.stringify(res, null, 4));

    expect(res.errors).toBeUndefined();
    expect(res.data).toHaveProperty(mutationName);
    expect(res.data[mutationName]).toHaveProperty("name", variables.name);
    expect(res.data[mutationName]).toHaveProperty(
      "userTagInfo.description",
      variables.description
    );
  });
});
