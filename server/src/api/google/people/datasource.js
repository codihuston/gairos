import { DataSource } from "apollo-datasource";
import { GooglePeople } from "../../";

/**
 * TODO: possibly revert to OAuth2 web requests instead of nodejs client for
 * apollo RESTDataSource caching support?
 */
export default {
  name: "PeopleAPI",
  class: class PeopleAPI extends DataSource {
    constructor() {
      super();
    }

    async get(opts) {
      return await GooglePeople.people.get(opts);
    }
  }
};
