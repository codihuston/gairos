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

      return res.users;
    }

    async create(userId, input) {
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
        isPublic: input.isPublic
      });

      // associate this user task to this task
      // EXPECTED: throws unique violation on userId if trying to
      // recreate the same task
      await task.setUserTaskInfo(userTask);

      // join the json together (for gql response)
      task.userTaskInfo = await task.getUserTaskInfo();

      return task;
    }

    async rename(userId, input) {
      // find the existing task
      const userTask = await this.models.userTask.findOne({
        where: {
          userId,
          userTaskId: input.userTaskId
        }
      });

      if (!userTask) {
        throw new Error("The given user task does not exist!");
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

      // console.log("QQQ TEMP", temp);

      return task;
    }
  }
};
