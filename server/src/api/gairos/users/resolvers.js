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
    setMyCalendar: combineResolvers(
      isAuthenticated,
      async (parent, { calendarId }, { me, dataSources }) => {
        try {
          const user = await dataSources.UserAPI.setCalendar(me.id, calendarId);
          return user;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    )
  }
};
