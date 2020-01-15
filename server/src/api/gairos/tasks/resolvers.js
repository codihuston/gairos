export default {
  Query: {
    getTasks: async (parent, args, { dataSources }) => {
      // TODO: handle bad response?
      return dataSources.TaskAPI.findAll();
    }
  },
  Mutation: {}
};
