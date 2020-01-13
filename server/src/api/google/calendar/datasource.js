import { DataSource } from "apollo-datasource";
import { calendar } from "../../";

/**
 * TODO: possibly revert to OAuth2 web requests instead of nodejs client for
 * apollo RESTDataSource caching support?
 */
export default {
  name: "CalendarAPI",
  class: class CalendarAPI extends DataSource {
    constructor() {
      super();
    }

    async list() {
      return calendar.calendarList.list();
    }
  }
};
