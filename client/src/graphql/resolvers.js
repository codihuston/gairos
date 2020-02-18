import { GET_MY_TRACKERS } from "./queries";

const findTracker = (trackers, id) => {
  for (let i = 0; i < trackers.length; i++) {
    if (trackers[i].id === id) {
      return trackers[i];
    }
  }
  return false;
};

export default {
  Mutation: {
    // TODO: get require fields
    addTracker(parent, args, { cache }) {
      console.log("QQQ ARGS", args);
      const { id, task, isTracking, originalTime, startTime } = args;

      // get existing trackers
      const queryResult = cache.readQuery({
        query: GET_MY_TRACKERS
      });

      // if there are any...
      if (queryResult) {
        const { getTrackers } = queryResult;
        let trackerExists = findTracker(getTrackers, task.userTaskInfo.id);

        // if tracker is already being tracked, skip caching it
        if (!trackerExists) {
          console.log("SPREAD", ...getTrackers);
          const data = {
            getTrackers: [
              ...getTrackers,
              // TODO: add fields as needed
              {
                type: "id",
                __typename: "Tracker",
                id,
                task,
                isTracking,
                startTime,
                originalTime
              }
            ]
          };

          console.log("QQQ write", data.getTrackers);
          // cache it
          cache.writeQuery({ query: GET_MY_TRACKERS, data });

          return data.getTrackers;
        }
      }
      return [];
    },
    updateTracker(parent, args, { cache }) {
      // TODO: implement on TRACKER UPDATE
      const { id, task, isTracking, startTime, originalTime } = args;

      // get existing trackers
      const queryResult = cache.readQuery({
        query: GET_MY_TRACKERS
      });

      // if there are any...
      if (queryResult) {
        const { getTrackers } = queryResult;
        // get the tracker-to-be-updated
        let trackerExists = findTracker(getTrackers, task.userTaskInfo.id);

        if (trackerExists) {
          // shape what will be stored in cache
          const otherTrackers = getTrackers.filter(
            tracker => tracker.task.userTaskInfo.id !== task.userTaskInfo.id
          );
          console.log("Other trackers", otherTrackers);

          const data = {
            getTrackers: [
              ...otherTrackers,
              // TODO: add fields as needed
              {
                type: "id",
                __typename: "Tracker",
                id,
                task,
                isTracking,
                startTime,
                originalTime
              }
            ]
          };

          // cache it
          cache.writeQuery({ query: GET_MY_TRACKERS, data });

          return data;
        } else {
          // the tracker does not exist...
        }
      }
      console.log("UPDATE TRACKER", args);
    },
    deleteTracker(parent, args, { cache }) {
      const { id } = args;

      // get existing trackers
      const queryResult = cache.readQuery({
        query: GET_MY_TRACKERS
      });

      // if there are any...
      if (queryResult) {
        const { getTrackers } = queryResult;
        // get the tracker-to-be-updated
        let trackerExists = findTracker(getTrackers, id);

        if (trackerExists) {
          // shape what will be stored in cache
          const otherTrackers = getTrackers.filter(
            tracker => tracker.task.userTaskInfo.id !== id
          );

          console.log("Other trackers", otherTrackers);

          // delete this task (set getTrackers to array without this obj)
          const data = {
            getTrackers: [...otherTrackers]
          };

          // cache it
          cache.writeQuery({ query: GET_MY_TRACKERS, data });

          return data;
        } else {
          // the tracker does not exist...
          console.warn(
            "A tracker does not exist for the given task... could not delete."
          );
        }
      } else {
        console.warn("There are no trackers of which to delete.");
      }
    }
  }
};
