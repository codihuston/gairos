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
    me: async (parent, args, context) => {
      // TODO: handle bad response?
      return context.models.user.findByPk(1);
    }
  },
  Mutation: {
    createUser: async (parent, args, context) => {
      try {
        const user = await context.models.user.create(args);
        return user;
      } catch (e) {
        throw SequelizeErrorHandler(e);
      }
    }
  }
};
