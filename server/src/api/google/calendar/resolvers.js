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
      { me, dataSources }
    ) => {
      return await dataSources.CalendarAPI.createCalendar(me.id, {
        summary,
        description
      });
    },
    createMyEvent: async (parent, { input }, { me, dataSources }) => {
      return await dataSources.CalendarAPI.createEvent(me.calendarId, input);
    }
  }
};
