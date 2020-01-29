import { createTestClient } from "apollo-server-testing";
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
let tag = null;
let userTag = null;
let tagHistory = [];

describe("user integration tests", function() {
  // pre-configure the test environment
  beforeAll(async () => {
    // use try/catch in async tests to handle unhandled promise rejections
    try {
      await expect(DatabaseConnector()).resolves.toBeUndefined();
      user = await createTestUser();
      expect(user).toEqual(expect.any(Object));

      // always return to ensure promises resolve before all tests
      return user;
    } catch (e) {
      console.error(e);
      expect(e).toBeUndefined();
    }
  });

  describe("creates entities related to user", function() {
    it("creates a user tag", async function() {
      try {
        // define data used for query/mutation
        const mutationName = "createMyTag";
        const mutation = mockMutations[mutationName];
        const variables = {
          name: "FAKE TASK",
          description: "FAKE DESCRIPTION"
        };
        // set user in context as expected by the apollo server
        const context = getDefaultContext({ me: user });

        // create an instance of the server
        const { server, typeDefs, dataSources } = await buildApolloServer({
          context
        });

        debug("context", context({ req: null, res: null }));

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
        expect(res.data[mutationName]).toHaveProperty("id");
        expect(res.data[mutationName]).toHaveProperty("name", variables.name);
        expect(res.data[mutationName]).toHaveProperty(
          "userTagInfo.description",
          variables.description
        );
        expect(res.data[mutationName]).toHaveProperty("userTagInfo.id");

        // store for additional testing later (if needed)
        tag = res.data[mutationName];
        userTag = res.data[mutationName].userTagInfo;
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });
  });

  describe("user tags", function() {
    it("renames a user tag", async function() {
      try {
        // define data used for query/mutation
        const mutationName = "renameMyTag";
        const mutation = mockMutations[mutationName];
        const variables = {
          userTagId: userTag.id,
          name: "NEW TAG NAME"
        };
        // define the expected response
        const expected = Object.assign({}, variables);
        // delete fields that are not expected to be returned
        delete expected.userTagId;
        // set user in context as expected by the apollo server
        const context = getDefaultContext({ me: user });

        // create an instance of the server
        const { server, typeDefs, dataSources } = await buildApolloServer({
          context
        });

        debug("context", context({ req: null, res: null }));

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
        expect(res.data[mutationName]).toHaveProperty(
          "userTagInfo.description",
          userTag.description
        );
        expect(res.data[mutationName]).toMatchObject(expected);

        // store for additional testing later (if needed)
        tagHistory.push(res.data[mutationName]);
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });

    it("updates a user tag", async function() {
      try {
        // define data used for query/mutation
        const mutationName = "updateMyTag";
        const mutation = mockMutations[mutationName];
        const variables = {
          userTagId: userTag.id,
          description: "UPDATED DESCRIPTION",
          isPublic: false,
          isArchived: true
        };
        // define the expected response
        const expected = Object.assign({}, variables);
        // delete fields that are not expected to be returned
        delete expected.userTagId;
        // set user in context as expected by the apollo server
        const context = getDefaultContext({ me: user });

        // create an instance of the server
        const { server, typeDefs, dataSources } = await buildApolloServer({
          context
        });

        debug("context", context({ req: null, res: null }));

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
        expect(res.data[mutationName]).toMatchObject(expected);

        // update for additional testing later
        userTag = res.data[mutationName];
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });

    it("deletes a user tag", async function() {
      try {
        // define data used for query/mutation
        const mutationName = "deleteMyTag";
        const mutation = mockMutations[mutationName];
        const variables = {
          userTagId: userTag.id
        };
        // set user in context as expected by the apollo server
        const context = getDefaultContext({ me: user });

        // create an instance of the server
        const { server, typeDefs, dataSources } = await buildApolloServer({
          context
        });

        debug("context", context({ req: null, res: null }));

        // init the test server
        const { mutate } = createTestClient(server);

        // submit gql query/mutation
        const res = await mutate({
          mutation,
          variables
        });

        debug("result", JSON.stringify(res, null, 4));

        expect(res.errors).toBeUndefined();
        expect(res.data[mutationName]).toEqual(true);
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });
  });
});
