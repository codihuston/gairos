import SequelizeErrorHandler from "../../../errors/sequelize";
import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "../../../middleware/graphql";

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
    getUserTags: async (parent, { userId }, { dataSources }) => {
      const res = await dataSources.UserAPI.getTags(userId);
      return res;
    },
    getUserTasks: async (parent, { userId }, { dataSources }) => {
      const res = await dataSources.UserAPI.getTasks(userId);
      return res;
    },
    getUserTaskHistory: async (parent, { userId }, { dataSources }) => {
      return await dataSources.UserAPI.getTaskHistory(userId);
    }
  },
  Mutation: {
    createUser: async (parent, args, { dataSources }) => {
      try {
        const user = await dataSources.UserAPI.create(args);
        return user;
      } catch (e) {
        throw SequelizeErrorHandler(e);
      }
    }
  }
};
