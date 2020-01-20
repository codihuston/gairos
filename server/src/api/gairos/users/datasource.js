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

    async getTasks(userId) {
      // fetch data
      const res = await this.models.user.findOne({
        where: {
          id: userId
        },
        include: [this.models.task]
      });

      console.log("QQQ getTasks", res);

      // return data shaped to what the graphql schema expects
      return this.reduceTasks(res.tasks);
    }

    async getTaskHistory(userId) {
      // const res = await this.models.user.findOne({
      //   where: {
      //     id: userId
      //   },
      //   include: [
      //     {
      //       model: this.models.task,
      //       // use N:M relationship via taskHistory alias defined in user model
      //       as: "taskHistory",
      //       through: {
      //         // attributes: ["startTime", "endTime"],
      //         where: {
      //           userId
      //         }
      //       }
      //     }
      //   ]
      // });

      const res = await this.models.userTaskHistory.findAll({
        where: {
          userId
        },
        include: [
          {
            model: this.models.task,
            include: [
              {
                // this works, returns 1 userTask per 1 history
                model: this.models.userTask,
                as: "taskUser"
              }
            ]
          }
        ]
      });
      console.log("QQQ res userTaskHistory", res[0]);
      console.log("QQQ res task", res[0].task);
      console.log("QQQ res userTasks", res[0].task.userTask);
      console.log("QQQ res userTasks", res[0].task.userTasks);
      // TODO: reduce user task history
      return this.reduceTaskHistory(res);
    }

    reduceTasks(tasks) {
      return tasks.map(({ id, name, userTask: { isPublic, description } }) => ({
        id,
        name,
        isPublic,
        description
      }));
    }

    reduceTaskHistory(tasks) {
      return tasks.map(
        ({
          userId,
          taskId,
          startTime,
          endTime,
          createdAt,
          updatedAt,
          task: {
            name,
            taskUser: { description }
          }
        }) => ({
          userId,
          taskId,
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
