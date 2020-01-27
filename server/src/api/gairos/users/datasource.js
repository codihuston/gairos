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

    async updateTaskHistory(userId, input) {
      // find the existing history object
      const userTaskHistory = await this.models.userTaskHistory.findOne({
        where: {
          id: input.id
        },
        include: [
          {
            model: this.models.userTask,
            as: "userTaskInfo",
            include: [
              {
                model: this.models.task
              }
            ]
          }
        ]
      });

      if (!userTaskHistory) {
        throw new Error("The given user task history does not exist!");
      }

      // if changing the userTaskId
      if (input.userTaskId) {
        // confirm that the user task exists (should be eager loaded by now)
        if (
          !userTaskHistory.userTaskInfo &&
          userTaskHistory.userTaskInfo.userId
        ) {
          throw new Error("The given user task does not exist!");
        }

        // confirm that the user owns it
        const doesThisUserOwnUserTask =
          userTaskHistory.userTaskInfo.userId === userId;
        if (!doesThisUserOwnUserTask) {
          throw new Error("This user does not own the given task!");
        }
      }

      // update history
      userTaskHistory.set(input);
      await userTaskHistory.save();

      return userTaskHistory;
    }

    async deleteTaskHistory(userId, input) {
      // find the existing userTask
      const userTaskHistory = await this.models.userTaskHistory.findOne({
        where: {
          id: input.id
        },
        include: [
          {
            model: this.models.userTask,
            as: "userTaskInfo"
          }
        ]
      });

      // throw if it doesn't exist
      if (!userTaskHistory) {
        throw new Error("The given user task history does not exist!");
      }

      // confirm that the user task exists (should be eager loaded by now)
      if (
        !userTaskHistory.userTaskInfo &&
        userTaskHistory.userTaskInfo.userId
      ) {
        throw new Error(
          "The task associated with this history record could not be found!"
        );
      }

      // confirm that the user owns it
      const doesThisUserOwnUserTask =
        userTaskHistory.userTaskInfo.userId === userId;
      if (!doesThisUserOwnUserTask) {
        throw new Error(
          "This user does not own the given task history record!"
        );
      }

      // delete it
      const res = await this.models.userTaskHistory.destroy({
        where: {
          id: input.id
        }
      });

      return res;
    }
  }
};
