export default {
  Query: {
    getMyCalendars: async (parent, args, { dataSources }) => {
      // TODO: handle bad response?
      return await dataSources.CalendarAPI.list();
    }
  },
  Mutation: {
    /**
     * Calendar
     */
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
    deleteMyCalendar: async (parent, args, { me, dataSources }) => {
      return await dataSources.CalendarAPI.deleteCalendar(me.calendarId);
    },
    createMyCalendarReminder: async (
      parent,
      { input },
      { me, dataSources }
    ) => {
      return await dataSources.CalendarAPI.createCalendarReminder(
        me.calendarId,
        input
      );
    },
    /**
     * Events
     */
    createMyEvent: async (parent, { input }, { me, dataSources }) => {
      return await dataSources.CalendarAPI.createEvent(me.calendarId, input);
    },
    deleteMyEvent: async (parent, { eventId }, { me, dataSources }) => {
      return await dataSources.CalendarAPI.deleteEvent(me.calendarId, eventId);
    }
  }
};
