import { createError } from "apollo-errors";
import { calendar } from "../../index";

export default {
  Query: {
    getCalendars: async (parent, args, context, info) => {
      // TODO: handle bad response?
      const res = await calendar.calendarList.list();

      return res.data.items;
    }
  }
};
