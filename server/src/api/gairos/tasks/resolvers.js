import { combineResolvers } from "graphql-resolvers";

import SequelizeErrorHandler from "../../../errors/sequelize";
import { UniqueViolationError } from "../../../errors/graphql";
import { isAuthenticated } from "../../../middleware/graphql";

export default {
  Query: {
    getTasks: async (parent, args, { dataSources }) => {
      // TODO: handle bad response?
      return dataSources.TaskAPI.get();
    },
    getTaskUsers: async (parent, { taskId }, { dataSources }) => {
      return dataSources.TaskAPI.getUsers(taskId);
    }
  },
  Mutation: {
    createTask: combineResolvers(
      isAuthenticated,
      async (async, { input }, { me, dataSources }) => {
        try {
          const task = await dataSources.TaskAPI.create(me.id, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e, [
            {
              matches: "unique violation",
              message: "You have already created this task!",
              errorToThrow: UniqueViolationError
            }
          ]);
        }
      }
    )
  }
};
