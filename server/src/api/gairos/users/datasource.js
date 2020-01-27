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

      return res;
    }

    /**
     * Updates a user with the given graphql input object
     *
     * @param {*} userId
     * @param {*} opts
     */
    async update(userId, input) {
      const user = await this.models.user.findOne({
        where: {
          id: userId
        }
      });

      user.set(input);

      user.save();

      return user;
    }

    async createTaskHistory(
      userId,
      { userTaskId, googleEventId, startTime, endTime }
    ) {
      // find the given userTaskId
      const userTask = await this.models.userTask.findOne({
        where: {
          userId,
          id: userTaskId
        },
        include: [
          {
            model: this.models.task
          }
        ]
      });

      if (!userTask) {
        throw new Error("The given user task does not exist!");
      }

      // confirm that this user owns this task
      const doesThisUserOwnThisUserTask = userTask.userId === userId;
      if (!doesThisUserOwnThisUserTask) {
        console.log("QQQ created", userTask);
        throw new Error("This user does not own the given task!");
      }

      // create history
      const userTaskHistory = await this.models.userTaskHistory.create({
        userTaskId,
        googleEventId,
        startTime,
        endTime
      });

      // associate
      userTaskHistory.setUserTaskInfo(userTask);

      // combine json for response
      userTaskHistory.userTaskInfo = userTask;

      return userTaskHistory;
    }
  }
};
