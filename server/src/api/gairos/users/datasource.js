import { DataSource } from "apollo-datasource";

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

    async create(opts) {
      return await this.models.user.create(opts);
    }

    async getTags(userId) {
      const res = await this.models.userTag.findAll({
        include: [
          {
            model: this.models.tag
          },
          {
            model: this.models.userTaskTag,
            include: [
              {
                model: this.models.task,
                include: [
                  {
                    model: this.models.userTask,
                    as: "userTaskInfo",
                    where: {
                      userId
                    }
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
      return res;
    }

    async getTasks(userId) {
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

      // return data shaped to what the graphql schema expects
      return res.tasks;
    }

    async getTaskHistory(userId) {
      const res = await this.models.userTaskHistory.findAll({
        where: {
          userId
        },
        include: [
          {
            model: this.models.task,
            include: [
              {
                model: this.models.userTask,
                as: "userTaskInfo",
                where: {
                  userId
                }
              }
            ]
          }
        ]
      });
      return res ? this.reduceTaskHistory(res) : [];
    }

    reduceTaskHistory(tasks) {
      return tasks.map(
        ({
          userId,
          taskId,
          googleEventId,
          startTime,
          endTime,
          createdAt,
          updatedAt,
          task: {
            name,
            userTaskInfo: { description }
          }
        }) => ({
          userId,
          taskId,
          googleEventId,
          name,
          description,
          startTime,
          endTime,
          createdAt,
          updatedAt
        })
      );
    }
  }
};
