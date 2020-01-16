import { models } from "../../src/db";

export default {
  up: async (queryInterface, Sequelize) => {
    /*
      Create tasks, users, and userTasks
    */
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
      id: "1bdc487a-8ad7-4264-b28d-d02dbbef787a",
      name: "Sample Task"
    });

    const user = await models.user.create({
      id: "0bdc487a-8ad7-4264-b28d-d02dbbef787b",
      username: "rwieruch"
    });

    const userTask = await user.addTask(task, {
      through: {
        description: "some description",
        isPublic: true
      }
    });

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
