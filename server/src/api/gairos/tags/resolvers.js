export default {
  Query: {
    getTags: async (parent, args, { dataSources }) => {
      // TODO: handle bad response?
      return dataSources.TagAPI.get();
    },
    getTagUsers: async (parent, { tagId }, { dataSources }) => {
      // TODO: handle bad response?
      return dataSources.TagAPI.getUsers(tagId);
    },
    getAllTagsAndUsers: async (parent, args, { dataSources }) => {
      // TODO: handle bad response?
      return dataSources.TagAPI.getAllTagsAndUsers();
    }
  },
  Mutation: {}
};
