import { DataSource } from "apollo-datasource";
import { GoogleCalendar } from "../../";

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
      return GoogleCalendar.calendarList.list();
    }
  }
};
