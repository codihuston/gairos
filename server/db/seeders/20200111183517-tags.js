import uuid from "uuid/v4";
import { models } from "../../src/db";

export default {
  up: async (queryInterface, Sequelize) => {
    /*
      Create tags
    */
    const tags = [
      {
        id: uuid(),
        name: "Health and Wellness",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        name: "Fitness",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        name: "Productivity",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        name: "Hobbies",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        name: "Leisure",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        name: "Work",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const tag of tags) {
      await models.tag.create(tag);
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
