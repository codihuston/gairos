import { combineResolvers } from "graphql-resolvers";

import SequelizeErrorHandler, {
  UniqueViolationError
} from "../../../errors/sequelize";
import { isAuthenticated, isGivenUser } from "../../../middleware/graphql";

export default {
  Query: {
    me: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, dataSources }) => {
        return me;
      }
    ),
    getMyTags: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, dataSources }) => {
        const res = await dataSources.UserAPI.getTags(me.id);
        return res;
      }
    ),
    getMyTasks: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, dataSources }) => {
        const res = await dataSources.UserAPI.getTasks(me.id);
        return res;
      }
    ),
    getMyTaskHistory: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, dataSources }) => {
        return await dataSources.UserAPI.getTaskHistory(me.id);
      }
    )
  },
  Mutation: {
    /**
     * Users
     */
    updateMyProfile: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const user = await dataSources.UserAPI.update(me.id, input);
          return user;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    ),
    deleteMyAccount: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { deleteCalendar }, { me, dataSources }) => {
        const { CalendarAPI } = dataSources;

        // delete their google calendar (conditionally)
        try {
          if (deleteCalendar) {
            CalendarAPI.deleteCalendar(me.calendarId);
          }
        } catch (e) {
          // if an exception is thrown while deleting
          if (e.code === 410 || e.code === 404) {
            // ignore it if the calendar doesn't exist / was already deleted
          } else {
            throw e;
          }
        }

        // then delete their account
        return await dataSources.UserAPI.deleteAccount(me.id);
      }
    ),
    /**
     * Tasks
     */
    createMyTask: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TaskAPI.createUserTask(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e, [
            UniqueViolationError("You have already created this task!")
          ]);
        }
      }
    ),
    tagMyTask: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TagAPI.tagUserTask(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e, [
            UniqueViolationError(
              "You have already linked this task to this tag!"
            )
          ]);
        }
      }
    ),
    renameMyTask: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TaskAPI.renameUserTask(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e, [
            UniqueViolationError("You have already have a task with this name!")
          ]);
        }
      }
    ),
    updateMyTask: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TaskAPI.updateUserTask(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    ),
    deleteMyTask: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TaskAPI.deleteUserTask(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    ),
    /**
     * Tags
     */
    createMyTag: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TagAPI.createUserTag(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e, [
            UniqueViolationError("You have already have a tag with this name!")
          ]);
        }
      }
    ),
    renameMyTag: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TagAPI.renameUserTag(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e, [
            UniqueViolationError("You have already have a tag with this name!")
          ]);
        }
      }
    ),
    updateMyTag: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TagAPI.updateUserTag(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    ),
    deleteMyTag: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const task = await dataSources.TagAPI.deleteUserTag(userId, input);
          return task;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    ),
    /**
     * Task History
     */
    createMyTaskHistory: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;

          // TODO: maybe save to gairos first, then add to google?
          // if the end time is specified
          if (input.endTime) {
            // save to google calendar with useterTaskInfo
            const event = await dataSources.CalendarAPI.createEventWithUserTask(
              input.userTaskId,
              me.id,
              me.calendarId,
              input
            );

            // set eventId (to be used by the TaskAPI)
            input.eventId = event.id;
          }

          // save to gairos db
          const userTaskHistory = await dataSources.TaskAPI.createUserTaskHistory(
            userId,
            input
          );

          return userTaskHistory;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    ),
    updateMyTaskHistory: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;

          // update in gairos
          const userTaskHistory = await dataSources.TaskAPI.updateUserTaskHistory(
            userId,
            input
          );

          // if it does, we need to update to google calendar (if there is one)
          if (userTaskHistory.eventId) {
            try {
              // update the existing google calendar event
              await dataSources.CalendarAPI.updateEventWithUserTask(
                me.calendarId,
                userTaskHistory.eventId,
                input,
                userTaskHistory
              );
            } catch (e) {
              /**
               * if we get a "not found" error from the google API, then let's
               * assume that the google event does not exist; let's clear out
               * the userTaskInfo.eventId and tell the end-user to
               * re-submit; this should force it down the code path in which
               * a new event is added to the google calendar.
               *
               * if the error persists, the calendar likely does not exist.
               */
              if (e.code && e.code === 404) {
                userTaskHistory.eventId = null;
                await userTaskHistory.save();

                throw new Error(
                  `There was a problem updating this task in your google calendar. Please try re-submitting. Error from google: ${e.message}`
                );
              }
              throw e;
            }
          }
          // if it does not, we need to create event in google calendar
          else {
            // save to google calendar with userTaskInfo
            const event = await dataSources.CalendarAPI.createEventWithUserTask(
              input.userTaskId,
              me.id,
              me.calendarId,
              input
            );

            // set eventId (to be used by the TaskAPI)
            userTaskHistory.eventId = event.id;

            // save the userTaskHistory again
            await userTaskHistory.save();
          }

          return userTaskHistory;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    ),
    deleteMyTaskHistory: combineResolvers(
      isAuthenticated,
      isGivenUser,
      async (parent, { input }, { me, dataSources }) => {
        try {
          const userId = input.userId ? input.userId : me.id;
          const { TaskAPI, CalendarAPI } = dataSources;

          // get existing instance from gairos
          let userTaskHistory = await TaskAPI.getUserTaskHistory({
            where: {
              id: input.id
            },
            include: [
              {
                model: TaskAPI.models.userTask,
                as: "userTaskInfo"
              }
            ]
          });

          // if no task was found, no deletion occured
          if (!userTaskHistory) {
            throw new Error("The given user task history does not exist!");
          }

          // delete from google before gairos (in case google throws an error
          // that we can handle)
          try {
            await CalendarAPI.deleteEvent(
              me.calendarId,
              userTaskHistory.eventId
            );
          } catch (e) {
            // google returns 410 if a resource was already deleted; 404 if the
            // event or calendar could not be found. If either is the case,
            // let's continue to delete the record from gairos after this
            // exception occurs
            if (e.code === 410 || e.code === 404) {
              // do nothing
            } else {
              // otherwise, throw this error
              throw e;
            }
          }

          // then delete from gairos
          const [
            taskHistoryInstance,
            wasDeleted
          ] = await TaskAPI.deleteUserTaskHistoryByInstance(
            userTaskHistory,
            userId,
            input
          );

          return wasDeleted;
        } catch (e) {
          throw SequelizeErrorHandler(e);
        }
      }
    )
  }
};
