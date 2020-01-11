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
    return Promise.all([
      models.user.create(
        {
          username: "rwieruch",
          messages: [
            {
              text: "Published the Road to learn React"
            }
          ]
        },
        {
          include: [models.message]
        }
      ),
      models.user.create(
        {
          username: "ddavids",
          messages: [
            {
              text: "Happy to release ..."
            },
            {
              text: "Published a complete ..."
            }
          ]
        },
        {
          include: [models.message]
        }
      )
    ]);
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
