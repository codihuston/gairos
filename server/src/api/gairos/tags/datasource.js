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

    async tagTask(userId, input) {
      // get this user's tag (to ensure that it is theirs)
      const userTag = await this.models.userTag.findOne({
        where: {
          id: input.userTagId
        }
      });

      // if the tag was found
      if (userTag && userTag.id) {
        // tag the task
        const userTaskTag = await this.models.userTaskTag.create(
          {
            userTagId: userTag.id,
            taskId: input.taskId
          }
          // Note: cannot eagerload task during creation
        );
        return userTaskTag;
      }
      // otherwise, throw an exception
      else {
        throw new Error(
          "The given tag does not exist, unable to link this task!"
        );
      }
    }

    async rename(userId, input) {
      // find the existing tag
      const userTag = await this.models.userTag.findOne({
        where: {
          userId,
          id: input.userTagId
        }
      });

      if (!userTag) {
        throw new Error("The given user tag does not exist!");
      }

      // throw if found, but not owned by the given userId
      const doesThisUserOwnThisTag = userTag.userId === userId;
      if (!doesThisUserOwnThisTag) {
        throw new Error("The given user does not own this tag!");
      }

      // find or create the given tag name
      let [tag, created] = await this.models.tag.findOrCreate({
        where: {
          name: input.name
        },
        defaults: {
          name: input.name
        }
      });

      // update the userTag reference to tag (in the database)
      await userTag.setTag(tag);

      // associate this user tag to this tag
      // EXPECTED: throws unique violation on userId if trying to
      // recreate the same tag
      await tag.setUserTagInfo(userTag);

      // join the json together (for gql response)
      tag.userTagInfo = await tag.getUserTagInfo();

      return tag;
    }
  }
};
