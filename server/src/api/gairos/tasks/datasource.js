import { DataSource } from "apollo-datasource";

export default {
  name: "TaskAPI",
  Class: class TaskAPI extends DataSource {
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
    async get() {
      return await this.models.task.findAll({
        include: [this.models.user]
      });
    }

    async getUsers(id) {
      const res = await this.models.task.findOne({
        where: {
          id
        },
        include: [this.models.user]
      });

      return res && res.users ? res.users : null;
    }

    async createUserTask(userId, input) {
      let userTask = null;

      const [task, created] = await this.models.task.findOrCreate({
        where: {
          name: input.name
        },
        defaults: {
          name: input.name
        }
      });

      // create the user task
      userTask = await this.models.userTask.create({
        userId,
        taskId: task.id,
        description: input.description,
        isPublic: input.isPublic,
        foregroundColor: input.foregroundColor,
        backgroundColor: input.backgroundColor
      });

      // associate this user task to this task
      // EXPECTED: throws unique violation on userId if trying to
      // recreate the same task
      await task.setUserTaskInfo(userTask);

      // join the json together (for gql response)
      task.userTaskInfo = await task.getUserTaskInfo();

      return task;
    }

    async renameUserTask(userId, input) {
      // find the existing task
      const userTask = await this.models.userTask.findOne({
        where: {
          userId,
          id: input.userTaskId
        }
      });

      if (!userTask) {
        throw new Error("The given user task does not exist!");
      }

      // throw if found, but not owned by the given userId
      const doesThisUserOwnThisTask = userTask.userId === userId;
      if (!doesThisUserOwnThisTask) {
        throw new Error("The given user does not own this task!");
      }

      // find or create the given task name
      let [task, created] = await this.models.task.findOrCreate({
        where: {
          name: input.name
        },
        defaults: {
          name: input.name
        }
      });

      // update the userTask reference to task (in the database)
      await userTask.setTask(task);

      // associate this user task to this task
      // EXPECTED: throws unique violation on userId if trying to
      // recreate the same task
      await task.setUserTaskInfo(userTask);

      // join the json together (for gql response)
      task.userTaskInfo = await task.getUserTaskInfo();

      return task;
    }

    async updateUserTask(userId, input) {
      // find the existing task
      const userTask = await this.models.userTask.findOne({
        where: {
          id: input.userTaskId
        }
      });

      if (!userTask) {
        throw new Error("The given user task does not exist!");
      }

      // throw if found, but not owned by the given userId
      const doesThisUserOwnThisTask = userTask.userId === userId;
      if (!doesThisUserOwnThisTask) {
        throw new Error("The given user does not own this task!");
      }

      // update the userTask
      await userTask.set(input);
      await userTask.save();

      return userTask;
    }

    async deleteUserTask(userId, input) {
      // find the existing userTask
      const userTask = await this.models.userTask.findOne({
        where: {
          id: input.userTaskId
        }
      });

      // throw if it doesn't exist
      if (!userTask) {
        throw new Error("The given task does not exist!");
      }

      // throw if found, but not owned by the given userId
      const doesThisUserOwnThisTask = userTask.userId === userId;
      if (!doesThisUserOwnThisTask) {
        throw new Error("The given user does not own this task!");
      }

      // delete it
      // NOTE: using static method (public method is broken for postgres, which
      // returns empty array [] as of 2020/01/27)
      // SEE: https://github.com/sequelize/sequelize/issues/10508
      const res = await this.models.userTask.destroy({
        where: {
          userId,
          id: input.userTaskId
        }
      });

      return res;
    }

    async createUserTaskHistory(
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

    async updateUserTaskHistory(userId, input) {
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
            ],
            where: {
              userId
            }
          }
        ]
      });

      if (!userTaskHistory) {
        throw new Error("The given user task history does not exist!");
      }

      // if changing the userTaskId
      if (input.userTaskId) {
        // TODO: an exception is thrown if a given userTaskId does not exist
        // in userTask table

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

    async deleteUserTaskHistory(userId, input) {
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

      return [userTaskHistory, res];
    }
  }
};
