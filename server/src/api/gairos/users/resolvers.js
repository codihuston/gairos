import { combineResolvers } from "graphql-resolvers";

import SequelizeErrorHandler, {
  UniqueViolationError
} from "../../../errors/sequelize";
import { isAuthenticated, isGivenUser } from "../../../middleware/graphql";

export default {
  Query: {
    me: async (parent, args, { me, dataSources }) => {
      return me;
    },
    getMyTags: async (parent, args, { me, dataSources }) => {
      const res = await dataSources.UserAPI.getTags(me.id);
      return res;
    },
    getMyTasks: async (parent, args, { me, dataSources }) => {
      const res = await dataSources.UserAPI.getTasks(me.id);
      return res;
    },
    getMyTaskHistory: async (parent, args, { me, dataSources }) => {
      return await dataSources.UserAPI.getTaskHistory(me.id);
    }
  },
  Mutation: {
    /**
     * Users
     */
    updateMyProfile: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const user = await dataSources.UserAPI.update(me.id, input);
          return user;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    ),
    deleteMyAccount: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, args, { me, dataSources }) => {
        return await dataSources.UserAPI.deleteAccount(me.id);
      }
    ),
    /**
     * Tasks
     */
    createMyTask: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TaskAPI.createUserTask(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e, [
            UniqueViolationError("You have already created this task!")
          ]);
        }
      }
    ),
    tagMyTask: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TagAPI.tagUserTask(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e, [
            UniqueViolationError(
              "You have already linked this task to this tag!"
            )
          ]);
        }
      }
    ),
    renameMyTask: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TaskAPI.renameUserTask(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e, [
            UniqueViolationError("You have already have a task with this name!")
          ]);
        }
      }
    ),
    updateMyTask: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TaskAPI.updateUserTask(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    ),
    deleteMyTask: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TaskAPI.deleteUserTask(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    ),
    /**
     * Tags
     */
    createMyTag: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TagAPI.createUserTag(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e, [
            UniqueViolationError("You have already have a tag with this name!")
          ]);
        }
      }
    ),
    renameMyTag: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TagAPI.renameUserTag(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e, [
            UniqueViolationError("You have already have a tag with this name!")
          ]);
        }
      }
    ),
    updateMyTag: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TagAPI.updateUserTag(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    ),
    deleteMyTag: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TagAPI.deleteUserTag(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    ),
    /**
     * Task History
     */
    createMyTaskHistory: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;

          // if the end time is specified
          if (input.endTime) {
            // save to google calendar with useterTaskInfo
            const event = await dataSources.CalendarAPI.createEventWithUserTask(
              input.userTaskId,
              me.id,
              me.calendarId,
              input
            );

            // set eventId (to be used by the TaskAPI)
            input.googleEventId = event.id;
          }

          // save to gairos db
          const userTaskHistory = await dataSources.TaskAPI.createUserTaskHistory(
            userId,
            input
          );

          return userTaskHistory;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    ),
    updateMyTaskHistory: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const user = await dataSources.TaskAPI.updateUserTaskHistory(
            userId,
            input
          );
          return user;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    ),
    deleteMyTaskHistory: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const user = await dataSources.TaskAPI.deleteUserTaskHistory(
            userId,
            input
          );
          return user;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    )
  }
};
