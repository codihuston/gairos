import { models } from "../../src/db";

export default {
  up: async (queryInterface, Sequelize) => {
    /*
      Create tasks, users, userTasks, tags, and userTags
    */
    const users = [
      {
        id: "0bdc487a-8ad7-4264-b28d-d02dbbef787b",
        username: "sample user A"
      },
      {
        id: "0bdc487a-8ad7-4264-b28d-d02dbbef787c",
        username: "sample user B"
      }
    ];
    const tasks = await models.task.findAll();

    let userTasks = [];

    for (const task of tasks) {
      userTasks.push({
        taskId: task.id,
        description: "custom description",
        isPublic: true
      });
    }

    const task = await models.task.create({
      id: "1bdc487a-8ad7-4264-b28d-d02dbbef786a",
      name: "Sample Task"
    });

    const tag = await models.tag.create({
      id: "1bdc487a-8ad7-4264-b28d-d02dbbef786b",
      name: "Sample Tag"
    });

    for (const user of users) {
      let tempUser = await models.user.create(user);

      await tempUser.addTag(tag, {
        through: {
          description: "my example activities",
          isPublic: true
        }
      });

      // NOTE:  you must pass a sequelize instance into the magic methods
      // described here: https://sequelize.org/master/manual/assocs.html
      const userTask = await tempUser.addTask(task, {
        through: {
          description: "some description",
          isPublic: true
        }
      });

      // create sequelize instance of this model (userTaskHistory); don't need
      // to use .add*() b/c this is a one-to-one relationship, and by specifying
      // the userTask id here, we've already associated these two entities
      const userTaskHistory = await models.userTaskHistory.create({
        userTaskId: userTask[0].id,
        startTime: new Date(),
        endTime: new Date()
      });
    }
    return;
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
