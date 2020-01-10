import { createError } from "apollo-errors";

export default {
  Query: {
    // get access to context
    hello: (parent, args, context, info) => {
      const { session } = context;

      console.log("Session in resolvers:", context.session);

      // Handle unauthorized requests
      // TODO: move into its own /errors file?
      const isAuthenticated = session.isAuthenticated || false;
      const hasAccessToken =
        (session.tokens && session.tokens.access_token) || false;

      const UnauthenticatedError = createError("UnauthenticatedError", {
        message: "You must log in to do that."
      });

      if (!isAuthenticated || !hasAccessToken) {
        throw new UnauthenticatedError();
      }

      return "Hello world!";
    },
    me: async (parent, args, context, info) => {
      // TODO: handle bad response?
      return context.models.user.findByPk(1);
    }
  }
};
