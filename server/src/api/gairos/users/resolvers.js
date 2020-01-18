import { UnauthenticatedError } from "../../../errors/graphql";
import SequelizeErrorHandler from "../../../errors/sequelize";

export default {
  Query: {
    // get access to context
    hello: (parent, args, context) => {
      const { session } = context;

      console.log("Session in resolvers:", context.session);

      // Handle unauthorized requests
      // TODO: move into its own /errors file?
      const isAuthenticated = session.isAuthenticated || false;
      const hasAccessToken =
        (session.tokens && session.tokens.access_token) || false;

      if (!isAuthenticated || !hasAccessToken) {
        throw new UnauthenticatedError();
      }

      return "Hello world!";
    },
    me: async (parent, args, { dataSources }) => {
      // TODO: handle bad response?
      return dataSources.UserAPI.findByPk(1);
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
