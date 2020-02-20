import { DataSource } from "apollo-datasource";
import debugLib from "debug";

const debug = debugLib("server:UserAPI");

export default {
  name: "UserAPI",
  Class: class UserAPI extends DataSource {
    constructor({ models, sequelize }) {
      super();
      this.models = models;
      this.sequelize = sequelize;
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

    async getTags(userId) {
      debug("call getTags() with args", userId);

      const res = await this.models.userTag.findAll({
        include: [
          {
            model: this.models.tag
          },
          {
            model: this.models.userTaskTag,
            include: [
              {
                model: this.models.userTask,
                as: "userTaskInfo",
                where: {
                  userId
                },
                include: [
                  {
                    model: this.models.task
                  }
                ]
              }
            ]
          }
        ],
        where: {
          userId
        }
      });

      debug("\tresult", res);

      return res;
    }

    async getTasks(userId) {
      debug("call getTasks() with args", userId);

      // fetch data
      const res = await this.models.user.findOne({
        where: {
          id: userId
        },
        include: [
          {
            model: this.models.task,
            include: [
              {
                model: this.models.userTask,
                as: "userTaskInfo"
              }
            ]
          }
        ]
      });

      debug("\tresult", res);

      // return data shaped to what the graphql schema expects
      return res && res.tasks ? res.tasks : [];
    }

    async getTaskHistory(userId) {
      debug("call getTaskHistory() with args", userId);

      const res = await this.models.userTaskHistory.findAll({
        include: [
          {
            model: this.models.userTask,
            as: "userTaskInfo",
            where: {
              userId
            },
            include: [
              {
                model: this.models.task
              }
            ]
          }
        ]
      });

      debug("\tresult", res);

      return res;
    }

    /**
     * Updates a user with the given graphql input object
     *
     * @param {*} userId
     * @param {*} opts
     */
    async update(userId, input) {
      debug("call update() with args", userId, input);

      const user = await this.models.user.findOne({
        where: {
          id: userId
        }
      });

      user.set(input);

      await user.save();

      debug("\tresult after save", user);

      return user;
    }

    /**
     * Deletes an account permanently from the database
     *
     * @param {*} userId
     * @param {*} opts
     */
    async deleteAccount(userId) {
      debug("call update() with args", userId);

      // remove default scope so we can find any potentially softDeleted user
      const user = await this.models.user.unscoped().findOne({
        where: {
          id: userId
        }
      });

      debug("\tfound user", user);

      // actually destroy it
      const res = await user.destroy({
        force: true
      });

      debug("\tresult after delete", res);

      return res ? true : false;
    }

    /**
     * Destroy the user's session...
     */
    async logout(session) {
      if (session && session.id) {
        const res = await this.models.session.destroy({
          where: {
            sid: session.id
          },
          force: true
        });

        console.log("Session destroyed", session.id, res);
        return res ? true : false;
      } else {
        return false;
      }
    }

    async getMyTaskReport(userId) {
      const query = `
      WITH cte_test AS (
        SELECT t.id AS "taskId", ut.id AS "userTaskId", t.name, ut.description, SUM(age(uth."endTime", uth."startTime")) AS exact FROM "userTasks"  AS ut
        LEFT JOIN "tasks" AS t ON ut."taskId" = t.id AND t."deletedAt" IS NULL
        LEFT JOIN "userTaskHistories" as uth ON ut.id = uth."userTaskId" AND ut."deletedAt" IS NULL
        WHERE "userId" = $userId AND uth."deletedAt" IS NULL
        GROUP BY ut.id, t.id, t.name
      )
      SELECT ctt."taskId", 
        ctt."userTaskId",
        ctt.name, ctt.description,
        ctt.exact,
        EXTRACT(EPOCH FROM ctt.exact)::NUMERIC AS "seconds",
        TRUNC((EXTRACT(EPOCH FROM ctt.exact)/60)::NUMERIC, 3) AS "minutes",
        TRUNC((EXTRACT(EPOCH FROM ctt.exact)/3600)::NUMERIC, 3) AS "hours",
        TRUNC((EXTRACT(EPOCH FROM ctt.exact)/86400)::NUMERIC, 4) AS "days",
        TRUNC((EXTRACT(EPOCH FROM ctt.exact)/604800)::NUMERIC, 4) "weeks"
        FROM cte_test AS ctt
        ORDER BY ctt.exact DESC
      `;

      if (!userId) {
        throw new Error(
          "A user is required in order to fetch their task report!"
        );
      }

      // NOTE: 'interval' data types are automatically nested into json objects
      const output = await this.sequelize.query(query, {
        dialectOptions: {
          decimalNumbers: true
        },
        bind: { userId },
        type: this.sequelize.QueryTypes.SELECT
      });

      return output;
    }
  }
};
