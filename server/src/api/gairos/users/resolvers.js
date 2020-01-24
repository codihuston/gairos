import { combineResolvers } from "graphql-resolvers";

import SequelizeErrorHandler, {
  UniqueViolationError
} from "../../../errors/sequelize";
import { isAuthenticated, isGivenUser } from "../../../middleware/graphql";

export default {
  Query: {
    // implements middleware for graphql a la combineResolvers()
    hello: combineResolvers(isAuthenticated, (parent, args, context) => {
      return "Hello world!";
    }),
    me: async (parent, args, { dataSources }) => {
      // TODO: handle bad response?
      return dataSources.UserAPI.findByPk(1);
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
    createMyTask: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (async, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TaskAPI.create(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e, [
            UniqueViolationError("You have already created this task!")
          ]);
        }
      }
    )
  }
};
