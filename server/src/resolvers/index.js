import { createError } from "apollo-errors";
import { calendar } from "../api/google";

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
    getCalendars: async (parent, args, context, info) => {
      // TODO: handle bad response?
      const res = await calendar.calendarList.list();

      return res.data.items;
    },
    me: async (parent, args, context, info) => {
      // TODO: handle bad response?
      return context.models.User.findByPk(1);
    }
  }
};
