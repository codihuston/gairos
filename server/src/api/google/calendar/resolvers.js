export default {
  Query: {
    getMyCalendars: async (parent, args, { dataSources }) => {
      // TODO: handle bad response?
      return await dataSources.CalendarAPI.list();
    }
  },
  Mutation: {
    createMyCalendar: async (
      parent,
      { summary, description },
      { dataSources }
    ) => {
      return await dataSources.CalendarAPI.createCalendar({
        summary,
        description
      });
    }
  }
};
