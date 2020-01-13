export default {
  Query: {
    getCalendars: async (parent, args, { dataSources }) => {
      // TODO: handle bad response?
      return await dataSources.CalendarAPI.list();
    }
  },
  Mutation: {
    createCalendar: async (
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
