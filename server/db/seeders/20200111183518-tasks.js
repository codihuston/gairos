import uuid from "uuid/v4";
import { models } from "../../src/db";

export default {
  up: async (queryInterface, Sequelize) => {
    /*
      Create tasks
    */
    const tasks = [
      {
        id: "0bdc487a-8ad7-4264-b28d-d02dbbef622a",
        name: "study",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "0bdc487a-8ad7-4264-b28d-d02dbbef622b",
        name: "work out",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "0bdc487a-8ad7-4264-b28d-d02dbbef622c",
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
