import { DataSource } from "apollo-datasource";

export default {
  name: "TagAPI",
  Class: class TagAPI extends DataSource {
    constructor({ models }) {
      super();
      this.models = models;
    }

    /**
     * This is a function that gets called by ApolloServer when being setup.
     * This function gets called with the datasource config including things
     * like caches and context. We'll assign this.context to the request context
     * here, so we can know about the user making requests
     */
    initialize(config) {
      this.context = config.context;
    }

    async get() {
      return await this.models.tag.findAll({
        include: [this.models.user]
      });
    }

    async getUsers(id) {
      const res = await this.models.tag.findOne({
        where: {
          id
        },
        include: [this.models.user]
      });

      return res.users[0];
    }

    async getAllTagsAndUsers() {
      const res = await this.models.tag.findAll({
        include: [this.models.user]
      });

      return res;
    }

    async create(userId, input) {
      let userTag = null;

      const [tag, created] = await this.models.tag.findOrCreate({
        where: {
          name: input.name
        },
        defaults: {
          name: input.name
        }
      });

      userTag = await this.models.userTag.create({
        userId,
        tagId: tag.id,
        description: input.description,
        isPublic: input.isPublic
      });

      await tag.setUserTagInfo(userTag);

      return tag;
    }
  }
};
