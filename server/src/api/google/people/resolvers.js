export default {
  Query: {
    getMyGoogleProfile: async (parent, args, { dataSources }) => {
      // TODO: handle bad response?
      const res = await dataSources.PeopleAPI.get({
        resourceName: "people/me",
        personFields: ["names", "emailAddresses"]
      });

      return res.data;
    }
  }
};
