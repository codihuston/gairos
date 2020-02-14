import { DataSource } from "apollo-datasource";
import debugLib from "debug";

const debug = debugLib("server:UserAPI");

export default {
  name: "UserAPI",
  Class: class UserAPI extends DataSource {
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

    /**
     * User can be called with an argument that includes email, but it doesn't
     * have to be. If the user is already on the context, it will use that user
     * instead
     */
    async findByPk(id) {
      return await this.models.user.findByPk(id);
    }

    async getTags(userId) {
      debug("call getTags() with args", userId);

      const res = await this.models.userTag.findAll({
        include: [
          {
            model: this.models.tag
          },
          {
            model: this.models.userTaskTag,
            include: [
              {
                model: this.models.userTask,
                as: "userTaskInfo",
                where: {
                  userId
                },
                include: [
                  {
                    model: this.models.task
                  }
                ]
              }
            ]
          }
        ],
        where: {
          userId
        }
      });

      debug("\tresult", res);

      return res;
    }

    async getTasks(userId) {
      debug("call getTasks() with args", userId);

      // fetch data
      const res = await this.models.user.findOne({
        where: {
          id: userId
        },
        include: [
          {
            model: this.models.task,
            include: [
              {
                model: this.models.userTask,
                as: "userTaskInfo"
              }
            ]
          }
        ]
      });

      debug("\tresult", res);

      // return data shaped to what the graphql schema expects
      return res && res.tasks ? res.tasks : [];
    }

    async getTaskHistory(userId) {
      debug("call getTaskHistory() with args", userId);

      const res = await this.models.userTaskHistory.findAll({
        include: [
          {
            model: this.models.userTask,
            as: "userTaskInfo",
            where: {
              userId
            },
            include: [
              {
                model: this.models.task
              }
            ]
          }
        ]
      });

      debug("\tresult", res);

      return res;
    }

    /**
     * Updates a user with the given graphql input object
     *
     * @param {*} userId
     * @param {*} opts
     */
    async update(userId, input) {
      debug("call update() with args", userId, input);

      const user = await this.models.user.findOne({
        where: {
          id: userId
        }
      });

      user.set(input);

      await user.save();

      debug("\tresult after save", user);

      return user;
    }

    /**
     * Deletes an account permanently from the database
     *
     * @param {*} userId
     * @param {*} opts
     */
    async deleteAccount(userId) {
      debug("call update() with args", userId);

      // remove default scope so we can find any potentially softDeleted user
      const user = await this.models.user.unscoped().findOne({
        where: {
          id: userId
        }
      });

      debug("\tfound user", user);

      // actually destroy it
      const res = await user.destroy({
        force: true
      });

      debug("\tresult after delete", res);

      return res ? true : false;
    }

    /**
     * Destroy the user's session...
     */
    async logout(session) {
      if (session && session.id) {
        const res = await this.models.session.destroy({
          where: {
            sid: session.id
          },
          force: true
        });

        console.log("Session destroyed", session.id, res);
        return res ? true : false;
      } else {
        return false;
      }
    }
  }
};
