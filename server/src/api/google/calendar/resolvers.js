export default {
  Query: {
    getCalendars: async (parent, args, { dataSources }, info) => {
      // TODO: handle bad response?
      const res = await dataSources.CalendarAPI.list();

      return res.data.items;
    }
  }
};
