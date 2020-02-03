import { DataSource } from "apollo-datasource";
import debugLib from "debug";

import { GoogleCalendar } from "../../";

const debug = debugLib("server:calendar api");

/**
 * TODO: possibly revert to OAuth2 web requests instead of nodejs client for
 * apollo RESTDataSource caching support?
 */
export default {
  name: "CalendarAPI",
  Class: class CalendarAPI extends DataSource {
    constructor({ models }) {
      super();
      this.models = models;
    }

    /**
     * Shapes the response into what our GraphQL schema expects. Use this if
     * you intend on changing the response data from the External API in anyway
     * (i.e. rename fields to match a name in the GraphQL Schema, etc.)
     */
    reducer(res) {
      return res;
    }

    eventReducer(res) {
      return res;
    }

    async list() {
      const res = await GoogleCalendar.calendarList.list();

      if (res.data && res.data.items) {
        return res.data.items.map(calendar => this.reducer(calendar));
      }
      return [];
    }

    /**
     * Returns an existing google calendar instance
     *
     * @param {*} calendarId
     */
    async doesCalendarExist(calendarId) {
      try {
        return await GoogleCalendar.calendars.get({
          calendarId
        });
      } catch (e) {
        if (e.code && e.code === 404) {
          // TODO: add a link to re-create a calendar in this case?
          throw new Error(
            "Your Google Calendar no longer exists; please visit your profile to re-create it."
          );
        }
        throw e;
      }
    }

    /**
     * Creates a calendar in google calendar
     *
     * @param {*} userId
     * @param {*} opts
     */
    async createCalendar(userId, opts) {
      // get the current user
      const user = await this.models.user.findOne({
        where: {
          id: userId
        }
      });

      if (!user) {
        throw new Error(
          "Failed to load the logged-in user; please login again."
        );
      }

      // create the google calendar
      const res = await GoogleCalendar.calendars.insert({
        resource: opts
      });

      // associate the google calendar with our database
      if (res.data && res.data.id) {
        user.calendarId = res.data.id;
        await user.save();
      } else {
        // TODO: handle google response errors more gracefully?
        throw new Error("Failed to create calendar. Please try again");
      }

      debug("create calendar result", res);

      return this.reducer(res && res.data ? res.data : null);
    }

    /**
     * Deletes a calendar from google
     * @param {*} userId
     * @param {*} opts
     */
    async deleteCalendar(calendarId) {
      if (!calendarId) {
        throw new Error(
          `The logged-in user does not have a google calendar associated with their account!`
        );
      }

      // delete the google calendar; throws if not found
      await GoogleCalendar.calendars.delete({
        calendarId
      });

      return true;
    }

    /**
     * Creates an event in google calendar
     *
     * @param {*} opts
     */
    async createEvent(calendarId, input) {
      // ensure calendar exists before operating on it...
      await this.doesCalendarExist(calendarId);

      const res = await GoogleCalendar.events.insert({
        calendarId,
        resource: input
      });

      debug("create calendar result", res);

      return this.eventReducer(res.data);
    }

    /**
     * Creates a google event with a pre-existing gairos user task history
     *
     * @param {*} userTaskId
     * @param {*} calendarId
     * @param {*} input : input for createUserTaskHistory
     */
    async createEventWithUserTask(userTaskId, userId, calendarId, input) {
      // destructured given input
      const { startTime, endTime, eventColorId } = input;

      // ensure calendar exists before operating on it...
      await this.doesCalendarExist(calendarId);

      // get the user task info
      const userTask = await this.models.userTask.findOne({
        where: {
          id: userTaskId,
          userId
        },
        include: [this.models.task]
      });

      if (!userTask) {
        throw new Error("The given user task does not exist!");
      }

      // create the event
      const event = await this.createEvent(calendarId, {
        // use the userTask instance to get event name/desc
        summary: userTask.getEventName(startTime, endTime),
        description: userTask.getEventDescription(),
        // use given colorId, or default to colorId defaulted in userTask
        colorId: eventColorId ? eventColorId : userTask.eventColorId,
        start: {
          dateTime: startTime
        },
        end: {
          dateTime: endTime
        }
      });

      debug("create calendar w/ user task result", event);

      // return the event
      return event;
    }

    /**
     *
     * @param {*} calendarId
     * @param {*} eventId
     * @param {*} input
     * @param {*} userTaskHistory: an instance of userTaskHistory with
     *            userTaskInfo (userTask) loaded
     */
    async updateEventWithUserTask(calendarId, eventId, input, userTaskHistory) {
      const { startTime, endTime, eventColorId } = input;
      const { userTaskInfo } = userTaskHistory;

      // ensure calendar exists before operating on it...
      await this.doesCalendarExist(calendarId);

      // throw if the userTaskInfo association is not loaded
      if (!userTaskInfo) {
        // this is a developer problem
        throw new Error(
          "The given user task instance does not have the user task information loaded! Please report this error to a developer."
        );
      }

      // define the defaults for this event color:

      // if color defined in taskHistory is set, use it
      let colorDefault = userTaskHistory.eventColorId
        ? userTaskHistory.eventColorId
        : null;
      // if it isn't, then use the given color (input)
      colorDefault = colorDefault
        ? colorDefault
        : eventColorId
        ? // if no color given, default to the color defined in userTask
          eventColorId
        : userTaskInfo.eventColorId;

      // update it
      const res = await GoogleCalendar.events.update({
        calendarId,
        eventId,
        resource: {
          summary: userTaskInfo.getEventName(startTime, endTime),
          description: userTaskInfo.getEventDescription(),
          // use given colorId, or default to colorId defaulted in userTask
          colorId: eventColorId ? eventColorId : userTaskInfo.eventColorId,
          start: {
            dateTime: startTime
          },
          end: {
            dateTime: endTime
          }
        }
      });

      debug("update calendar result", res);

      return this.eventReducer(res.data);
    }

    /**
     * Deletes an event from google calendar (not from gairos!)
     *
     * @param {*} opts
     */
    async deleteEvent(calendarId, eventId) {
      // ensure calendar exists before operating on it...
      await this.doesCalendarExist(calendarId);

      const res = await GoogleCalendar.events.delete({
        calendarId,
        eventId
      });

      debug("delete calendar result", res);

      return res ? true : false;
    }

    /**
     * NOTE: it appears that this only sets the TIME WINDOW before EACH EVENT
     * sends out a notification; each event can have a custom notification
     * window, too.
     *
     * As it stands, this does NOT add a visible reminder to your calendar!
     *
     * Surely there is a way to do this without having to put an event on the
     * calendar. This is what I wanted to use when generating/suggesting
     * schedules, so this is NOT necessary for the Alpha release
     * @param {*} calendarId
     * @param {*} input
     */
    async createCalendarReminder(calendarId, input) {
      // get the calendar
      const calendar = await GoogleCalendar.calendarList.get({
        calendarId
      });

      console.log("QQQQ calendar results", calendar);
      console.log("QQQQ calendar reminders", calendar.data.defaultReminders);

      const args = Object.assign({}, calendar.data);
      args.defaultReminders.push(input);

      console.log("QQQQ input", input);
      console.log("QQQQ args", args);

      const res = await GoogleCalendar.calendarList.update({
        calendarId: "primary",
        requestBody: {
          defaultReminders: input
        }
      });

      // append to the defaultReminders
      console.log("QQQQ res reminders", res.data);
      console.log("QQQQ res reminders", res.data.defaultReminders);

      // save it
    }
  }
};
