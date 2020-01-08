import { createError } from "apollo-errors";
// TODO: provide a better way of fetching the google calendar api obj
import { calendar_v3 } from "googleapis";
import { oauth2Client } from "../services/auth/google";
const calender = new calendar_v3.Calendar({
  auth: oauth2Client
});

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
      const res = await calender.calendarList.list();

      return res.data.items;
    }
  }
};
