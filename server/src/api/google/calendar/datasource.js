import { DataSource } from "apollo-datasource";
import debugLib from "debug";
import { GoogleCalendar } from "../../";
import resolvers from "./resolvers";

const debug = debugLib("server:calendar api");

/**
 * TODO: possibly revert to OAuth2 web requests instead of nodejs client for
 * apollo RESTDataSource caching support?
 */
export default {
  name: "CalendarAPI",
  Class: class CalendarAPI extends DataSource {
    constructor() {
      super();
    }

    /**
     * Shapes the response into what our GraphQL schema expects. Use this if
     * you intend on changing the response data from the External API in anyway
     * (i.e. rename fields to match a name in the GraphQL Schema, etc.)
     */
    reducer(res) {
      return res;
    }

    async list() {
      const res = await GoogleCalendar.calendarList.list();

      if (res.data && res.data.items) {
        return res.data.items.map(calendar => this.reducer(calendar));
      }
      return res.data.items;
    }

    async createCalendar(opts) {
      const res = await GoogleCalendar.calendars.insert({
        resource: opts
      });
      debug("create calendar result", res);
      return this.reducer(res.data);
    }
  }
};
