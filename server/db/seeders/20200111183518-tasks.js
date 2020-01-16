import uuid from "uuid/v4";
import { models } from "../../src/db";

export default {
  up: async (queryInterface, Sequelize) => {
    /*
      Create tasks
    */
    const tasks = [
      {
        id: uuid(),
        name: "study",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        name: "work out",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        name: "clean",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const task of tasks) {
      await models.task.create(task);
    }
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
