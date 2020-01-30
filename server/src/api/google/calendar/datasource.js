import { DataSource } from "apollo-datasource";
import debugLib from "debug";
import { GoogleCalendar } from "../../";

const debug = debugLib("server:calendar api");

/**
 * TODO: possibly revert to OAuth2 web requests instead of nodejs client for
 * apollo RESTDataSource caching support?
 */
export default {
  name: "CalendarAPI",
  Class: class CalendarAPI extends DataSource {
    constructor({ models }) {
      super();
      this.models = models;
    }

    /**
     * Shapes the response into what our GraphQL schema expects. Use this if
     * you intend on changing the response data from the External API in anyway
     * (i.e. rename fields to match a name in the GraphQL Schema, etc.)
     */
    reducer(res) {
      return res;
    }

    eventReducer(res) {
      return res;
    }

    async list() {
      const res = await GoogleCalendar.calendarList.list();

      if (res.data && res.data.items) {
        return res.data.items.map(calendar => this.reducer(calendar));
      }
      return [];
    }

    async createCalendar(userId, opts) {
      // get the current user
      const user = await this.models.user.findOne({
        where: {
          id: userId
        }
      });

      if (!user) {
        throw new Error(
          "Failed to load the logged-in user; please login again."
        );
      }

      // create the google calendar
      const res = await GoogleCalendar.calendars.insert({
        resource: opts
      });

      // associate the google calendar with our database
      if (res.data && res.data.id) {
        user.calendarId = res.data.id;
        await user.save();
      } else {
        throw new Error("Failed to create calendar. Please try again");
      }

      debug("create calendar result", res);

      return this.reducer(res && res.data ? res.data : null);
    }

    /**
     *
     * @param {*} opts
     */
    async createEvent(calendarId, input) {
      const res = await GoogleCalendar.events.insert({
        calendarId,
        resource: input
      });

      debug("create calendar result", res);

      return this.eventReducer(res.data);
    }
  }
};
