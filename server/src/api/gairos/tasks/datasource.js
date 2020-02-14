import { DataSource } from "apollo-datasource";
import debugLib from "debug";

const debug = debugLib("server:TaskAPI");

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
      debug("call get()");

      const res = await this.models.task.findAll({
        include: [this.models.user]
      });

      debug("\tresult", res);

      return res;
    }

    async getUserTask(opts = {}) {
      debug("call getUserTask() with args", opts);

      const res = await this.models.userTask.findOne(opts);

      debug("\tresult", res);

      return res;
    }

    async getUserTaskHistory(opts = {}) {
      debug("call getUserTaskHistory() with args", opts);

      const res = await this.models.userTaskHistory.findOne(opts);

      debug("\tresult", res);

      return res;
    }

    async getUsers(id) {
      debug("call getUserTaskHistory() with args", id);

      const res = await this.models.task.findOne({
        where: {
          id
        },
        include: [this.models.user]
      });

      debug("\tresult", res);

      return res && res.users ? res.users : null;
    }

    async createUserTask(userId, input) {
      debug("call createUserTask() with args", userId, input);

      const [task, created] = await this.models.task.findOrCreate({
        where: {
          name: input.name
        },
        defaults: {
          name: input.name
        }
      });

      debug("\ttask was created", created);
      debug("\tcreated/found task", task);

      // create the user task
      const [
        userTask,
        userTaskWasCreated
      ] = await this.models.userTask.unscoped().findOrCreate({
        where: {
          userId,
          taskId: task.id
        },
        defaults: {
          userId,
          taskId: task.id,
          description: input.description,
          isPublic: input.isPublic,
          eventColorId: input.eventColorId
        },
        // required w/ .unscoped() in order to find soft-deleted records
        paranoid: false
      });

      // if the user deleted a task, then re-created it, they'll get a unique
      // constraint violation; if they follow this workflow, just re-enable
      // the deleted record
      debug("\tuser task was created", userTaskWasCreated);
      debug("\tcreated/found user task", userTask);

      // un-delete if they are re-creating a task they've had in the past
      if (userTask.deletedAt) {
        await this.models.userTask.unscoped().update(
          { deletedAt: null },
          {
            where: {
              id: userTask.id
            },
            paranoid: false
          }
        );
        debug("\tundelete userTask", userTask.deletedAt);
      }

      // associate this user task to this task
      // EXPECTED: throws unique violation on userId if trying to
      // recreate the same task
      await task.setUserTaskInfo(userTask);

      // join the json together (for gql response)
      task.userTaskInfo = await task.getUserTaskInfo();

      debug("\tcreated userTask", userTask);
      debug("\tresult", task);

      return task;
    }

    async renameUserTask(userId, input) {
      debug("call renameUserTask() with args", userId, input);
      // find the existing task
      const userTask = await this.getUserTask({
        where: {
          userId,
          id: input.userTaskId
        }
      });

      if (!userTask) {
        throw new Error("The given user task does not exist!");
      }

      debug("\tfound userTask", userTask);

      // throw if found, but not owned by the given userId
      const doesThisUserOwnThisTask = userTask.userId === userId;

      debug("\tdoes user own this task?", doesThisUserOwnThisTask);

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

      debug("\ttask was created?", created);

      // update the userTask reference to task (in the database)
      await userTask.setTask(task);

      // associate this user task to this task
      // EXPECTED: throws unique violation on userId if trying to
      // recreate the same task
      await task.setUserTaskInfo(userTask);

      // join the json together (for gql response)
      task.userTaskInfo = await task.getUserTaskInfo();

      debug("\tresult", task);

      return task;
    }

    async updateUserTask(userId, input) {
      debug("\tcall updateUserTask() with args", userId, input);

      // find the existing task
      const userTask = await this.getUserTask({
        where: {
          id: input.userTaskId
        }
      });

      debug("\tfound userTask", userTask);

      if (!userTask) {
        throw new Error("The given user task does not exist!");
      }

      // throw if found, but not owned by the given userId
      const doesThisUserOwnThisTask = userTask.userId === userId;

      debug("\tdoes user own this task?", doesThisUserOwnThisTask);

      if (!doesThisUserOwnThisTask) {
        throw new Error("The given user does not own this task!");
      }

      // update the userTask
      await userTask.set(input);
      await userTask.save();

      debug("\tresult", userTask);

      return userTask;
    }

    async deleteUserTask(userId, input) {
      debug("call deleteUserTask() with args", userId, input);

      // find the existing userTask
      const userTask = await this.getUserTask({
        where: {
          id: input.userTaskId
        }
      });

      debug("\tfound userTask", userTask);

      // throw if it doesn't exist
      if (!userTask) {
        throw new Error("The given task does not exist!");
      }

      // throw if found, but not owned by the given userId
      const doesThisUserOwnThisTask = userTask.userId === userId;

      debug("\tdoes user own this task", doesThisUserOwnThisTask);

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

      debug("\tresult", res);

      return res;
    }

    async createUserTaskHistory(
      userId,
      { userTaskId, eventId, eventColorId, startTime, endTime }
    ) {
      debug("call createUserTaskHistory() with args", userId, {
        userTaskId,
        eventId,
        eventColorId,
        startTime,
        endTime
      });

      // find the given userTaskId
      const userTask = await this.getUserTask({
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

      debug("\tfound userTask", userTask);

      if (!userTask) {
        throw new Error("The given user task does not exist!");
      }

      // confirm that this user owns this task
      const doesThisUserOwnThisUserTask = userTask.userId === userId;

      debug("\tdoes user own this task?", doesThisUserOwnThisUserTask);

      if (!doesThisUserOwnThisUserTask) {
        throw new Error("This user does not own the given task!");
      }

      // create history
      const userTaskHistory = await this.models.userTaskHistory.create({
        userTaskId,
        eventId,
        eventColorId: eventColorId ? eventColorId : userTask.eventColorId,
        startTime,
        endTime
      });

      // associate
      userTaskHistory.setUserTaskInfo(userTask);

      // combine json for response
      userTaskHistory.userTaskInfo = userTask;

      debug("\tcreated user task history", userTaskHistory);
      return userTaskHistory;
    }

    async updateUserTaskHistory(userId, input) {
      let colorDefault = input.eventColorId;

      debug("call updateUserTaskHistory() with args", userId, input);

      // find the existing history object
      const userTaskHistory = await this.getUserTaskHistory({
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

      debug("\tfound userTaskHistory", userTaskHistory);

      if (!userTaskHistory) {
        throw new Error("The given user task history does not exist!");
      }

      // if changing the userTaskId
      if (input.userTaskId) {
        // TODO: an exception is thrown if a given userTaskId does not exist
        // in userTask table

        debug("\tbegin updating userTaskId");

        // confirm that the user task exists (should be eager loaded by now)
        const doesUserTaskExist =
          !userTaskHistory.userTaskInfo && userTaskHistory.userTaskInfo.userId;

        debug(
          "\t does this userTask exist on this instance?",
          doesUserTaskExist
        );

        if (doesUserTaskExist) {
          throw new Error("The given user task does not exist!");
        }

        // confirm that the user owns it
        const doesThisUserOwnUserTask =
          userTaskHistory.userTaskInfo.userId === userId;

        debug("\t does this user own this userTask?", doesThisUserOwnUserTask);

        if (!doesThisUserOwnUserTask) {
          throw new Error("This user does not own the given task!");
        }

        debug(
          "\tbegin updating userTaskId from",
          userTaskHistory.userTaskInfo.id,
          "to",
          input.userTaskId,
          "(can be the same)"
        );
      }

      // always use a given eventColorId
      debug("\tdefault color id to input value", colorDefault);

      // if it is null, fall back to the eventColorId in the userTaskHistory
      if (colorDefault === null) {
        colorDefault = userTaskHistory.eventColorId;
        debug("\tdefault color id to userTaskHistory value", colorDefault);
      }

      // if the color for this history instance is null, use the userTask color
      if (
        colorDefault === null &&
        userTaskHistory.userTaskInfo &&
        userTaskHistory.userTaskInfo.eventColorId
      ) {
        debug("\tdefault color id to userTask value", colorDefault);
        colorDefault = userTaskHistory.userTaskInfo.eventColorId;
      }

      debug("\tdetermined color id", colorDefault);

      // update history
      const newValues = Object.assign({}, input);
      newValues.eventColorId = colorDefault;
      userTaskHistory.set(newValues);
      await userTaskHistory.save();

      debug("\tresults", userTaskHistory);

      return userTaskHistory;
    }

    async deleteUserTaskHistoryByInstance(userTaskHistory, userId, input) {
      debug(
        "call deleteUserTaskHistoryByInstance() with args",
        userTaskHistory,
        userId,
        input
      );

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

      debug("\t does user own this task", doesThisUserOwnUserTask);

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

      debug("\t result (as array)", [userTaskHistory, res]);

      return [userTaskHistory, res];
    }

    async deleteUserTaskHistory(userId, input) {
      debug("call deleteUserTaskHistory() with args", userId, input);

      // find the existing userTask
      const userTaskHistory = await this.getUserTaskHistory({
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
      return this.deleteUserTaskHistoryByInstance(
        userTaskHistory,
        userId,
        input
      );
    }
  }
};
