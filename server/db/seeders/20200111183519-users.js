import { models } from "../../src/api/gairos";

export default {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
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

    console.log("Should create", userTasks);

    // const user = await models.user.create(
    //   {
    //     id: "0bdc487a-8ad7-4264-b28d-d02dbbef787b",
    //     username: "rwieruch",
    //     messages: [
    //       {
    //         text: "Published the Road to learn React"
    //       }
    //     ],
    //     tasks: userTasks
    //   },
    //   {
    //     include: [
    //       {
    //         model: models.message,
    //         as: "messages"
    //       },
    //       {
    //         model: models.userTask,
    //         as: "tasks"
    //       }
    //     ]
    //   }
    // );

    const task = await models.task.create({
      id: "1bdc487a-8ad7-4264-b28d-d02dbbef787a",
      name: "Sample Task"
    });

    console.log("TASK", task);

    const user = await models.user.create({
      id: "0bdc487a-8ad7-4264-b28d-d02dbbef787b",
      username: "rwieruch"
    });

    console.log("USER", user);

    const userTask = await user.addTask(task, {
      through: {
        description: "some description",
        isPublic: true
      }
    });

    console.log("USER TASK", userTask);

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
