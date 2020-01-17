export default {
  Query: {
    getTasks: async (parent, args, { dataSources }) => {
      // TODO: handle bad response?
      return dataSources.TaskAPI.findAll();
    },
    getTaskUsers: async (parent, { taskId }, { dataSources }) => {
      return dataSources.TaskAPI.getUsers(taskId);
    }
  },
  Mutation: {}
};
