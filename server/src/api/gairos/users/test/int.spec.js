import { createTestClient } from "apollo-server-testing";
import debugLib from "debug";
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
    it("creates user tag", async function() {
      const debug = debugLib("test:creates user tag");

      try {
        // define data used for query/mutation
        const mutationName = "createMyTag";
        const mutation = mockMutations[mutationName];
        const variables = {
          name: "FAKE TAG",
          description: "FAKE DESCRIPTION",
          foregroundColor: "#ffffff",
          backgroundColor: "#000000"
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

    it("creates user task", async function() {
      const debug = debugLib("test:creates user task");

      try {
        // define data used for query/mutation
        const mutationName = "createMyTask";
        const mutation = mockMutations[mutationName];
        const variables = {
          name: "FAKE TASK",
          description: "FAKE DESCRIPTION",
          eventColorId: "1"
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

    it("creates user task history", async function() {
      const debug = debugLib("test:creates user task history");

      try {
        // get current time in milliseconds
        const nowAsISO = moment().toISOString();
        const mutationName = "createMyTaskHistory";
        const mutation = mockMutations[mutationName];
        const variables = {
          userTaskId: userTask.id,
          eventId: "FAKE ID",
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

        // mock the 3rd party API used in this call
        const { CalendarAPI } = dataSources;

        CalendarAPI.createEventWithUserTask = jest.fn();
        CalendarAPI.createEventWithUserTask.mockReturnValue(
          mockResponses.createEventWithUserTask.reduced(variables)
        );

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
        expect(res.data[mutationName]).toHaveProperty(
          "eventId",
          variables.eventId
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
    it("updates user task history", async function() {
      const debug = debugLib("test:updates user task history");

      try {
        // get current time in milliseconds
        const nowAsISO = moment().toISOString();
        // define data used for query/mutation
        const mutationName = "updateMyTaskHistory";
        const mutation = mockMutations[mutationName];
        const variables = {
          id: userTaskHistory.id,
          userTaskId: userTask.id,
          eventColorId: "2",
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

        // mock the 3rd party API used in this call
        const { CalendarAPI } = dataSources;

        // we really don't care what these return in either case
        CalendarAPI.createEventWithUserTask = jest.fn();
        CalendarAPI.createEventWithUserTask.mockReturnValue(
          mockResponses.createEventWithUserTask.reduced(variables)
        );
        CalendarAPI.updateEventWithUserTask = jest.fn();
        CalendarAPI.updateEventWithUserTask.mockReturnValue(
          mockResponses.updateEventWithUserTask.reduced(variables)
        );

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
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });

    it("deletes user task history", async function() {
      const debug = debugLib("test:deletes user task history");

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

        debug("context", context({ req: null, res: null }));

        // mock the 3rd party API used in this call
        const { CalendarAPI } = dataSources;

        // we really don't care what these return in either case
        CalendarAPI.deleteEvent = jest.fn();
        CalendarAPI.deleteEvent.mockReturnValue(mockResponses.deleteEvent);

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

  describe("user tags", function() {
    it("renames user tag", async function() {
      const debug = debugLib("test:renames user tag");

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
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });

    it("updates user tag", async function() {
      const debug = debugLib("test:updates user tag");

      try {
        // define data used for query/mutation
        const mutationName = "updateMyTag";
        const mutation = mockMutations[mutationName];
        const variables = {
          userTagId: userTag.id,
          description: "UPDATED DESCRIPTION",
          isPublic: false,
          isArchived: true,
          foregroundColor: "#000000",
          backgroundColor: "#ffffff"
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

    it("deletes user tag", async function() {
      const debug = debugLib("test:deletes user tag");

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

  describe("user tasks", function() {
    it("renames user task", async function() {
      const debug = debugLib("test: renames user task");

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
          "userTaskInfo.description",
          userTask.description
        );
        expect(res.data[mutationName]).toMatchObject(expected);
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });

    it("updates user task", async function() {
      const debug = debugLib("test:updates user task");

      try {
        // define data used for query/mutation
        const mutationName = "updateMyTask";
        const mutation = mockMutations[mutationName];
        const variables = {
          userTaskId: userTask.id,
          description: "UPDATED DESCRIPTION",
          isPublic: false,
          isArchived: true,
          eventColorId: "1"
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
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });

    it("deletes user task", async function() {
      const debug = debugLib("test:deletes user task");

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

  describe("user profile", function() {
    it("updates user's profile", async function() {
      const debug = debugLib("test:updates user profile");

      try {
        // define data used for query/mutation
        const mutationName = "updateMyProfile";
        const mutation = mockMutations[mutationName];
        const variables = {
          username: "TEST USERNAME",
          email: "REAL@EMAIL.COM",
          isFirstSetupCompleted: true,
          calendarId: "FAKE ID",
          calendarColorId: "3",
          scheduleCalendarId: "FAKE ID",
          scheduleCalendarColorId: "4"
        };
        // define the expected response
        const expected = Object.assign({}, variables);

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
      } catch (e) {
        console.error(e);
        expect(e).toBeUndefined();
      }
    });
  });
});
