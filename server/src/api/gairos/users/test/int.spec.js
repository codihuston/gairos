import { createTestClient } from "apollo-server-testing";
import debug from "debug";
import moment from "moment";

import DatabaseConnector from "../../../../db";
import {
  getDefaultContext,
  buildApolloServer,
  createTestUser
} from "../../../../test/utils";
import { mockResponses, mockQueries, mockMutations } from ".";

let tag = null;
let task = null;
let user = null;
let userTag = null;
let userTask = null;
let userTaskHistory = null;

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
      const log = debug("test:creates a user tag");

      try {
        // define data used for query/mutation
        const mutationName = "createMyTag";
        const mutation = mockMutations[mutationName];
        const variables = {
          name: "FAKE TAG",
          description: "FAKE DESCRIPTION"
        };
        // set user in context as expected by the apollo server
        const context = getDefaultContext({ me: user });

        // create an instance of the server
        const { server, typeDefs, dataSources } = await buildApolloServer({
          context
        });

        log("context", context({ req: null, res: null }));

        // init the test server
        const { mutate } = createTestClient(server);

        // submit gql query/mutation
        const res = await mutate({
          mutation,
          variables
        });

        log("result", JSON.stringify(res, null, 4));

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

    it("creates a user task", async function() {
      const log = debug("test:creates a user task");

      try {
        // define data used for query/mutation
        const mutationName = "createMyTask";
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

        log("context", context({ req: null, res: null }));

        // init the test server
        const { mutate } = createTestClient(server);

        // submit gql query/mutation
        const res = await mutate({
          mutation,
          variables
        });

        log("result", JSON.stringify(res, null, 4));

        expect(res.errors).toBeUndefined();
        expect(res.data).toHaveProperty(mutationName);
        expect(res.data[mutationName]).toHaveProperty("id");
        expect(res.data[mutationName]).toHaveProperty("name", variables.name);
        expect(res.data[mutationName]).toHaveProperty(
          "userTaskInfo.description",
          variables.description
        );
        expect(res.data[mutationName]).toHaveProperty("userTaskInfo.id");

        // store for additional testing later (if needed)
        task = res.data[mutationName];
        userTask = res.data[mutationName].userTaskInfo;
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });

    it("creates a user task history", async function() {
      const log = debug("test:creates a user task");

      try {
        // get current time in milliseconds
        const nowAsISO = moment().toISOString();
        const mutationName = "createMyTaskHistory";
        const mutation = mockMutations[mutationName];
        const variables = {
          userTaskId: userTask.id,
          googleEventId: "FAKE ID",
          startTime: nowAsISO,
          endTime: nowAsISO
        };
        // define the expected response
        const expected = Object.assign({}, variables);
        // delete fields that are not expected to be returned
        delete expected.userTaskId;
        // set user in context as expected by the apollo server
        const context = getDefaultContext({ me: user });

        // create an instance of the server
        const { server, typeDefs, dataSources } = await buildApolloServer({
          context
        });

        log("context", context({ req: null, res: null }));

        // init the test server
        const { mutate } = createTestClient(server);

        // submit gql query/mutation
        const res = await mutate({
          mutation,
          variables
        });

        log("result", JSON.stringify(res, null, 4));

        expect(res.errors).toBeUndefined();
        expect(res.data).toHaveProperty(mutationName);
        expect(res.data[mutationName]).toHaveProperty("id");
        expect(res.data[mutationName]).toHaveProperty(
          "googleEventId",
          variables.googleEventId
        );
        expect(res.data[mutationName]).toHaveProperty(
          "userTaskInfo.id",
          variables.userTaskId
        );
        expect(res.data[mutationName]).toMatchObject(expected);

        // store for additional testing later (if needed)
        userTaskHistory = res.data[mutationName];
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });
  });

  // do this first, so we don't run into FK error on deleting a user task
  describe("user task history", function() {
    it("updates a user task history", async function() {
      const log = debug("test:updates a user tag");

      try {
        // get current time in milliseconds
        const nowAsISO = moment().toISOString();
        // define data used for query/mutation
        const mutationName = "updateMyTaskHistory";
        const mutation = mockMutations[mutationName];
        const variables = {
          id: userTaskHistory.id,
          userTaskId: userTask.id,
          googleEventId: "FAKE ID",
          startTime: nowAsISO,
          endTime: nowAsISO
        };
        // define the expected response
        const expected = Object.assign({}, variables);
        // delete fields that are not expected to be returned
        delete expected.userTaskId;
        // set user in context as expected by the apollo server
        const context = getDefaultContext({ me: user });

        // create an instance of the server
        const { server, typeDefs, dataSources } = await buildApolloServer({
          context
        });

        log("context", context({ req: null, res: null }));

        // init the test server
        const { mutate } = createTestClient(server);

        // submit gql query/mutation
        const res = await mutate({
          mutation,
          variables
        });

        log("result", JSON.stringify(res, null, 4));

        expect(res.errors).toBeUndefined();
        expect(res.data).toHaveProperty(mutationName);
        expect(res.data[mutationName]).toMatchObject(expected);
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });

    it("deletes a user task history", async function() {
      const log = debug("test:deletes a user task");

      try {
        // define data used for query/mutation
        const mutationName = "deleteMyTaskHistory";
        const mutation = mockMutations[mutationName];
        const variables = {
          id: userTaskHistory.id
        };
        // set user in context as expected by the apollo server
        const context = getDefaultContext({ me: user });

        // create an instance of the server
        const { server, typeDefs, dataSources } = await buildApolloServer({
          context
        });

        log("context", context({ req: null, res: null }));

        // init the test server
        const { mutate } = createTestClient(server);

        // submit gql query/mutation
        const res = await mutate({
          mutation,
          variables
        });

        log("result", JSON.stringify(res, null, 4));

        expect(res.errors).toBeUndefined();
        expect(res.data[mutationName]).toEqual(true);
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });
  });

  describe("user tags", function() {
    it("renames a user tag", async function() {
      const log = debug("test:renames a user tag");

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

        log("context", context({ req: null, res: null }));

        // init the test server
        const { mutate } = createTestClient(server);

        // submit gql query/mutation
        const res = await mutate({
          mutation,
          variables
        });

        log("result", JSON.stringify(res, null, 4));

        expect(res.errors).toBeUndefined();
        expect(res.data).toHaveProperty(mutationName);
        expect(res.data[mutationName]).toHaveProperty(
          "userTagInfo.description",
          userTag.description
        );
        expect(res.data[mutationName]).toMatchObject(expected);
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });

    it("updates a user tag", async function() {
      const log = debug("test:updates a user tag");

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

        log("context", context({ req: null, res: null }));

        // init the test server
        const { mutate } = createTestClient(server);

        // submit gql query/mutation
        const res = await mutate({
          mutation,
          variables
        });

        log("result", JSON.stringify(res, null, 4));

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
      const log = debug("test:deletes a user tag");

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

        log("context", context({ req: null, res: null }));

        // init the test server
        const { mutate } = createTestClient(server);

        // submit gql query/mutation
        const res = await mutate({
          mutation,
          variables
        });

        log("result", JSON.stringify(res, null, 4));

        expect(res.errors).toBeUndefined();
        expect(res.data[mutationName]).toEqual(true);
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });
  });

  describe("user tasks", function() {
    it("renames a user task", async function() {
      const log = debug("test: renames a user task");

      try {
        // define data used for query/mutation
        const mutationName = "renameMyTask";
        const mutation = mockMutations[mutationName];
        const variables = {
          userTaskId: userTask.id,
          name: "NEW TASK NAME"
        };
        // define the expected response
        const expected = Object.assign({}, variables);
        // delete fields that are not expected to be returned
        delete expected.userTaskId;
        // set user in context as expected by the apollo server
        const context = getDefaultContext({ me: user });

        // create an instance of the server
        const { server, typeDefs, dataSources } = await buildApolloServer({
          context
        });

        log("context", context({ req: null, res: null }));

        // init the test server
        const { mutate } = createTestClient(server);

        // submit gql query/mutation
        const res = await mutate({
          mutation,
          variables
        });

        log("result", JSON.stringify(res, null, 4));

        expect(res.errors).toBeUndefined();
        expect(res.data).toHaveProperty(mutationName);
        expect(res.data[mutationName]).toHaveProperty(
          "userTaskInfo.description",
          userTask.description
        );
        expect(res.data[mutationName]).toMatchObject(expected);
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });

    it("updates a user task", async function() {
      const log = debug("test:updates a user task");

      try {
        // define data used for query/mutation
        const mutationName = "updateMyTask";
        const mutation = mockMutations[mutationName];
        const variables = {
          userTaskId: userTask.id,
          description: "UPDATED DESCRIPTION",
          isPublic: false,
          isArchived: true
        };
        // define the expected response
        const expected = Object.assign({}, variables);
        delete expected.userTaskId;
        expected.id = userTask.id;

        // set user in context as expected by the apollo server
        const context = getDefaultContext({ me: user });

        // create an instance of the server
        const { server, typeDefs, dataSources } = await buildApolloServer({
          context
        });

        log("context", context({ req: null, res: null }));

        // init the test server
        const { mutate } = createTestClient(server);

        // submit gql query/mutation
        const res = await mutate({
          mutation,
          variables
        });

        log("result", JSON.stringify(res, null, 4));

        expect(res.errors).toBeUndefined();
        expect(res.data).toHaveProperty(mutationName);
        expect(res.data[mutationName]).toMatchObject(expected);
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });

    it("deletes a user task", async function() {
      const log = debug("test:deletes a user task");

      try {
        // define data used for query/mutation
        const mutationName = "deleteMyTask";
        const mutation = mockMutations[mutationName];
        const variables = {
          userTaskId: userTask.id
        };
        // set user in context as expected by the apollo server
        const context = getDefaultContext({ me: user });

        // create an instance of the server
        const { server, typeDefs, dataSources } = await buildApolloServer({
          context
        });

        log("context", context({ req: null, res: null }));

        // init the test server
        const { mutate } = createTestClient(server);

        // submit gql query/mutation
        const res = await mutate({
          mutation,
          variables
        });

        log("result", JSON.stringify(res, null, 4));

        expect(res.errors).toBeUndefined();
        expect(res.data[mutationName]).toEqual(true);
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });
  });

  describe("user profile", function() {
    it("updates user's profile", async function() {
      const log = debug("test:updates a user profile");

      try {
        // define data used for query/mutation
        const mutationName = "updateMyProfile";
        const mutation = mockMutations[mutationName];
        const variables = {
          username: "TEST USERNAME",
          email: "REAL@EMAIL.COM",
          isFirstSetupCompleted: true,
          calendarId: "FAKE ID"
        };
        // define the expected response
        const expected = Object.assign({}, variables);

        // set user in context as expected by the apollo server
        const context = getDefaultContext({ me: user });

        // create an instance of the server
        const { server, typeDefs, dataSources } = await buildApolloServer({
          context
        });

        log("context", context({ req: null, res: null }));

        // init the test server
        const { mutate } = createTestClient(server);

        // submit gql query/mutation
        const res = await mutate({
          mutation,
          variables
        });

        log("result", JSON.stringify(res, null, 4));

        expect(res.errors).toBeUndefined();
        expect(res.data).toHaveProperty(mutationName);
        expect(res.data[mutationName]).toMatchObject(expected);
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });
  });
});
